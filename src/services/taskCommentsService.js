// Task Comments Service - Database operations for task discussions
import { supabase } from '../config/supabase';

class TaskCommentsService {
  // Get all comments for a task
  async getTaskComments(taskId) {
    try {
      const { data, error } = await supabase
        .from('task_comments')
        .select('*')
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { success: true, comments: data || [] };
    } catch (error) {
      console.error('Get comments error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create a new comment
  async createComment(taskId, userId, userName, userEmail, content) {
    try {
      if (!content || content.trim().length === 0) {
        throw new Error('Comment cannot be empty');
      }

      const { data, error } = await supabase
        .from('task_comments')
        .insert({
          task_id: taskId,
          user_id: userId,
          user_name: userName,
          user_email: userEmail,
          content: content.trim(),
        })
        .select();

      if (error) throw error;

      // Increment task comments count
      await this._updateTaskCommentCount(taskId);

      return { success: true, comment: data[0] };
    } catch (error) {
      console.error('Create comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update a comment
  async updateComment(commentId, newContent) {
    try {
      if (!newContent || newContent.trim().length === 0) {
        throw new Error('Comment cannot be empty');
      }

      const { data, error } = await supabase
        .from('task_comments')
        .update({
          content: newContent.trim(),
          updated_at: new Date().toISOString(),
          is_edited: true,
        })
        .eq('id', commentId)
        .select();

      if (error) throw error;
      return { success: true, comment: data[0] };
    } catch (error) {
      console.error('Update comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete a comment
  async deleteComment(commentId, taskId) {
    try {
      const { error } = await supabase
        .from('task_comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Decrement task comments count
      await this._updateTaskCommentCount(taskId);

      return { success: true };
    } catch (error) {
      console.error('Delete comment error:', error);
      return { success: false, error: error.message };
    }
  }

  // Private: Update comments count on task
  async _updateTaskCommentCount(taskId) {
    try {
      const { data: comments, error: countError } = await supabase
        .from('task_comments')
        .select('id', { count: 'exact' })
        .eq('task_id', taskId);

      if (countError) throw countError;

      const count = comments?.length || 0;

      await supabase
        .from('tasks')
        .update({ comments_count: count })
        .eq('id', taskId);
    } catch (error) {
      console.error('Update comments count error:', error);
    }
  }

  // Get comment count for a task
  async getCommentCount(taskId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('comments_count')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return { success: true, count: data?.comments_count || 0 };
    } catch (error) {
      console.error('Get comment count error:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to real-time comment updates
  subscribeToComments(taskId, callback) {
    const subscription = supabase
      .channel(`task_comments:${taskId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'task_comments',
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  }
}

export default TaskCommentsService;
