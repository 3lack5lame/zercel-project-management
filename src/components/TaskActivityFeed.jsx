import { formatDistanceToNow } from "date-fns";
import { Activity, MessageCircle, CheckCircle, Edit2, FileText } from "lucide-react";
import TaskActivityService from "../services/taskActivityService";

const TaskActivityFeed = ({ activities = [], isLoading = false }) => {
  const activityService = new TaskActivityService();

  // Get icon based on action type
  const getActivityIcon = (actionType) => {
    const icons = {
      created: <FileText className="size-4 text-blue-500" />,
      status_changed: <CheckCircle className="size-4 text-green-500" />,
      title_changed: <Edit2 className="size-4 text-yellow-500" />,
      description_changed: <Edit2 className="size-4 text-yellow-500" />,
      commented: <MessageCircle className="size-4 text-purple-500" />,
      assigned: <Activity className="size-4 text-orange-500" />,
      default: <Activity className="size-4 text-gray-500" />,
    };
    return icons[actionType] || icons.default;
  };

  // Get color badge based on action type
  const getActivityBadgeColor = (actionType) => {
    const colors = {
      created: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200",
      status_changed:
        "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
      title_changed:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      description_changed:
        "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200",
      commented:
        "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
      assigned:
        "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
      default: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200",
    };
    return colors[actionType] || colors.default;
  };

  // Get label for action type
  const getActionLabel = (actionType) => {
    const labels = {
      created: "Created",
      status_changed: "Status Changed",
      title_changed: "Title Updated",
      description_changed: "Description Updated",
      commented: "Commented",
      assigned: "Assigned",
      default: "Updated",
    };
    return labels[actionType] || labels.default;
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-20 bg-gray-200 dark:bg-zinc-700 rounded-md animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-zinc-400">
        <Activity className="size-12 mb-3 opacity-50" />
        <p className="text-sm">No activity yet</p>
        <p className="text-xs">Changes to this task will appear here</p>
      </div>
    );
  }

  // Group activities by date
  const groupedActivities = {};
  activities.forEach((activity) => {
    const date = new Date(activity.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    if (!groupedActivities[date]) {
      groupedActivities[date] = [];
    }
    groupedActivities[date].push(activity);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedActivities).map(([date, dateActivities]) => (
        <div key={date}>
          {/* Date Separator */}
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-zinc-400 uppercase">
            <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-700" />
            {date}
            <div className="h-px flex-1 bg-gray-300 dark:bg-zinc-700" />
          </div>

          {/* Activities for this date */}
          <div className="space-y-3">
            {dateActivities.map((activity) => (
              <div
                key={activity.id}
                className="p-3 rounded-md border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
              >
                <div className="flex gap-3">
                  {/* Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.action_type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activityService.formatActivityMessage(activity)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>

                      {/* Badge */}
                      <span
                        className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${getActivityBadgeColor(
                          activity.action_type
                        )}`}
                      >
                        {getActionLabel(activity.action_type)}
                      </span>
                    </div>

                    {/* Show old/new values for updates */}
                    {activity.action_type === "status_changed" && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-zinc-400">
                        <span className="line-through opacity-60">
                          {activity.old_value}
                        </span>
                        {" → "}
                        <span className="font-medium text-green-600 dark:text-green-400">
                          {activity.new_value}
                        </span>
                      </div>
                    )}

                    {activity.action_type === "title_changed" && (
                      <div className="mt-2 text-xs text-gray-600 dark:text-zinc-400">
                        <span className="font-mono bg-gray-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
                          {activity.new_value}
                        </span>
                      </div>
                    )}

                    {activity.action_type === "commented" && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-zinc-700 rounded text-xs italic text-gray-700 dark:text-zinc-300 border-l-2 border-purple-400">
                        "{activity.new_value}"
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskActivityFeed;
