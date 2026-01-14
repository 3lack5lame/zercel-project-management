import { format } from "date-fns";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CalendarIcon, MessageCircle, PenIcon, Activity } from "lucide-react";
import { assets } from "../assets/assets";
import { useAuth } from "../context/useAuth";
import TaskCommentsService from "../services/taskCommentsService";
import TaskActivityService from "../services/taskActivityService";
import CommentForm from "../components/CommentForm";
import CommentsList from "../components/CommentsList";
import TaskActivityFeed from "../components/TaskActivityFeed";
import { supabase } from "../config/supabase";

const TaskDetails = () => {
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get("projectId");
    const taskId = searchParams.get("taskId");
    const { user } = useAuth();

    const [task, setTask] = useState(null);
    const [project, setProject] = useState(null);
    const [comments, setComments] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [activitySubscription, setActivitySubscription] = useState(null);
    const [activeTab, setActiveTab] = useState("comments"); // 'comments' or 'activity'

    const { currentWorkspace } = useSelector((state) => state.workspace);
    const commentsService = new TaskCommentsService();
    const activityService = new TaskActivityService();

    // Fetch comments from database
    const fetchComments = async () => {
        if (!taskId) return;
        setCommentsLoading(true);
        try {
            const result = await commentsService.getTaskComments(taskId);
            if (result.success) {
                setComments(result.comments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    };

    // Fetch activities from database
    const fetchActivities = async () => {
        if (!taskId) return;
        setActivitiesLoading(true);
        try {
            const result = await activityService.getTaskActivity(taskId);
            if (result.success) {
                setActivities(result.activities);
            }
        } catch (error) {
            console.error('Error fetching activities:', error);
        } finally {
            setActivitiesLoading(false);
        }
    };

    // Fetch task details from Redux store
    const fetchTaskDetails = async () => {
        setLoading(true);
        if (!projectId || !taskId) return;

        const proj = currentWorkspace.projects.find((p) => p.id === projectId);
        if (!proj) return;

        const tsk = proj.tasks.find((t) => t.id === taskId);
        if (!tsk) return;

        setTask(tsk);
        setProject(proj);
        setLoading(false);
    };

    // Handle adding a new comment
    const handleAddComment = async (commentData) => {
        try {
            toast.loading("Adding comment...");
            const result = await commentsService.createComment(
                commentData.task_id,
                commentData.user_id,
                commentData.user_name,
                commentData.user_email,
                commentData.content
            );

            if (result.success) {
                setComments([...comments, result.comment]);
                toast.dismiss();
                toast.success("Comment added successfully!");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.dismiss();
            toast.error(error?.message || "Failed to add comment");
            console.error(error);
        }
    };

    // Handle editing a comment
    const handleEditComment = async (commentId, newContent) => {
        try {
            toast.loading("Updating comment...");
            const result = await commentsService.updateComment(commentId, newContent);

            if (result.success) {
                setComments(comments.map(c => c.id === commentId ? result.comment : c));
                toast.dismiss();
                toast.success("Comment updated!");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to update comment");
            console.error(error);
        }
    };

    // Handle deleting a comment
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;

        try {
            toast.loading("Deleting comment...");
            const result = await commentsService.deleteComment(commentId, taskId);

            if (result.success) {
                setComments(comments.filter(c => c.id !== commentId));
                toast.dismiss();
                toast.success("Comment deleted!");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            toast.dismiss();
            toast.error("Failed to delete comment");
            console.error(error);
        }
    };

    // Subscribe to real-time updates
    useEffect(() => {
        if (taskId) {
            const sub = commentsService.subscribeToComments(taskId, (payload) => {
                // Refresh comments on any change
                fetchComments();
            });
            setSubscription(sub);

            const actSub = activityService.subscribeToActivity(taskId, (payload) => {
                // Refresh activities on any change
                fetchActivities();
            });
            setActivitySubscription(actSub);
        }

        return () => {
            if (subscription) {
                subscription.unsubscribe();
            }
            if (activitySubscription) {
                activitySubscription.unsubscribe();
            }
        };
    }, [taskId]);

    useEffect(() => {
        fetchTaskDetails();
    }, [taskId]);

    useEffect(() => {
        if (taskId && task) {
            fetchComments();
            fetchActivities();
        }
    }, [taskId, task]);

    if (loading) return <div className="text-gray-500 dark:text-zinc-400 px-4 py-6">Loading task details...</div>;
    if (!task) return <div className="text-red-500 px-4 py-6">Task not found.</div>;

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-6 sm:p-4 text-gray-900 dark:text-zinc-100 max-w-6xl mx-auto">
            {/* Left: Comments / Discussion */}
            <div className="w-full lg:w-2/3">
                <div className="p-5 rounded-md border border-gray-300 dark:border-zinc-800 flex flex-col lg:h-[80vh]">
                    {/* Tabs */}
                    <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-zinc-700">
                        <button
                            onClick={() => setActiveTab("comments")}
                            className={`pb-2 px-3 text-sm font-medium transition-colors ${
                                activeTab === "comments"
                                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <MessageCircle className="size-4" /> Comments ({comments.length})
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`pb-2 px-3 text-sm font-medium transition-colors ${
                                activeTab === "activity"
                                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                <Activity className="size-4" /> Activity ({activities.length})
                            </div>
                        </button>
                    </div>

                    {/* Comments Tab */}
                    {activeTab === "comments" && (
                        <>
                            <div className="flex-1 md:overflow-y-auto no-scrollbar">
                                <CommentsList
                                    comments={comments}
                                    currentUserId={user?.id}
                                    onEditComment={handleEditComment}
                                    onDeleteComment={handleDeleteComment}
                                    isLoading={commentsLoading}
                                />
                            </div>

                            {/* Add Comment Form */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-zinc-700">
                                <CommentForm
                                    taskId={taskId}
                                    onCommentAdded={handleAddComment}
                                />
                            </div>
                        </>
                    )}

                    {/* Activity Tab */}
                    {activeTab === "activity" && (
                        <div className="flex-1 md:overflow-y-auto no-scrollbar">
                            <TaskActivityFeed activities={activities} isLoading={activitiesLoading} />
                        </div>
                    )}
                </div>
            </div>

            {/* Right: Task + Project Info */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6">
                {/* Task Info */}
                <div className="p-5 rounded-md bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-800 ">
                    <div className="mb-3">
                        <h1 className="text-lg font-medium text-gray-900 dark:text-zinc-100">{task.title}</h1>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-300 text-xs">
                                {task.status}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-300 text-xs">
                                {task.type}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-green-200 dark:bg-emerald-900 text-green-900 dark:text-emerald-300 text-xs">
                                {task.priority}
                            </span>
                        </div>
                    </div>

                    {task.description && (
                        <p className="text-sm text-gray-600 dark:text-zinc-400 leading-relaxed mb-4">{task.description}</p>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-700 my-3" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-zinc-300">
                        <div className="flex items-center gap-2">
                            <img src={task.assignee?.image} className="size-5 rounded-full" alt="avatar" />
                            {task.assignee?.name || "Unassigned"}
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="size-4 text-gray-500 dark:text-zinc-500" />
                            Due : {format(new Date(task.due_date), "dd MMM yyyy")}
                        </div>
                    </div>
                </div>

                {/* Project Info */}
                {project && (
                    <div className="p-4 rounded-md bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-200 border border-gray-300 dark:border-zinc-800 ">
                        <p className="text-xl font-medium mb-4">Project Details</p>
                        <h2 className="text-gray-900 dark:text-zinc-100 flex items-center gap-2"> <PenIcon className="size-4" /> {project.name}</h2>
                        <p className="text-xs mt-3">Project Start Date: {format(new Date(project.start_date), "dd MMM yyyy")}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-zinc-400 mt-3">
                            <span>Status: {project.status}</span>
                            <span>Priority: {project.priority}</span>
                            <span>Progress: {project.progress}%</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetails;
