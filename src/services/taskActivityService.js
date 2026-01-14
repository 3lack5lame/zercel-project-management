import { supabase } from "../config/supabase";

class TaskActivityService {
  /**
   * Get all activity for a task
   * @param {string} taskId - Task ID
   * @returns {Promise<{success: boolean, activities: Array, error?: string}>}
   */
  async getTaskActivity(taskId) {
    try {
      const { data, error } = await supabase
        .from("task_activity")
        .select("*")
        .eq("task_id", taskId)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, activities: [], error: error.message };
      }

      return {
        success: true,
        activities: data || [],
      };
    } catch (error) {
      console.error("Error fetching task activity:", error);
      return { success: false, activities: [], error: error.message };
    }
  }

  /**
   * Get activity for specific action type
   * @param {string} taskId - Task ID
   * @param {string} actionType - Action type to filter by
   * @returns {Promise<{success: boolean, activities: Array, error?: string}>}
   */
  async getActivityByType(taskId, actionType) {
    try {
      const { data, error } = await supabase
        .from("task_activity")
        .select("*")
        .eq("task_id", taskId)
        .eq("action_type", actionType)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, activities: [], error: error.message };
      }

      return {
        success: true,
        activities: data || [],
      };
    } catch (error) {
      console.error("Error fetching activity by type:", error);
      return { success: false, activities: [], error: error.message };
    }
  }

  /**
   * Get activity by user
   * @param {string} taskId - Task ID
   * @param {string} userId - User ID to filter by
   * @returns {Promise<{success: boolean, activities: Array, error?: string}>}
   */
  async getActivityByUser(taskId, userId) {
    try {
      const { data, error } = await supabase
        .from("task_activity")
        .select("*")
        .eq("task_id", taskId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, activities: [], error: error.message };
      }

      return {
        success: true,
        activities: data || [],
      };
    } catch (error) {
      console.error("Error fetching activity by user:", error);
      return { success: false, activities: [], error: error.message };
    }
  }

  /**
   * Get summary of task changes (last 30 days)
   * @param {string} taskId - Task ID
   * @returns {Promise<{success: boolean, summary: Object, error?: string}>}
   */
  async getActivitySummary(taskId) {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("task_activity")
        .select("action_type, user_name")
        .eq("task_id", taskId)
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (error) {
        return { success: false, summary: {}, error: error.message };
      }

      // Count by action type
      const summary = {
        total: data?.length || 0,
        by_type: {},
        contributors: new Set(),
      };

      data?.forEach((item) => {
        summary.by_type[item.action_type] =
          (summary.by_type[item.action_type] || 0) + 1;
        summary.contributors.add(item.user_name);
      });

      summary.contributors = Array.from(summary.contributors);

      return { success: true, summary };
    } catch (error) {
      console.error("Error fetching activity summary:", error);
      return { success: false, summary: {}, error: error.message };
    }
  }

  /**
   * Subscribe to real-time activity updates
   * @param {string} taskId - Task ID
   * @param {Function} callback - Called when activity changes
   * @returns {Object} Subscription object with unsubscribe method
   */
  subscribeToActivity(taskId, callback) {
    const subscription = supabase
      .channel(`task_activity:${taskId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_activity",
          filter: `task_id=eq.${taskId}`,
        },
        (payload) => {
          callback(payload);
        }
      )
      .subscribe();

    return subscription;
  }

  /**
   * Get timeline of changes for a specific field
   * @param {string} taskId - Task ID
   * @param {string} fieldName - Field name to track
   * @returns {Promise<{success: boolean, timeline: Array, error?: string}>}
   */
  async getFieldTimeline(taskId, fieldName) {
    try {
      const { data, error } = await supabase
        .from("task_activity")
        .select("*")
        .eq("task_id", taskId)
        .eq("field_name", fieldName)
        .order("created_at", { ascending: false });

      if (error) {
        return { success: false, timeline: [], error: error.message };
      }

      return {
        success: true,
        timeline: data || [],
      };
    } catch (error) {
      console.error("Error fetching field timeline:", error);
      return { success: false, timeline: [], error: error.message };
    }
  }

  /**
   * Format activity message for display
   * @param {Object} activity - Activity record
   * @returns {string} Formatted message
   */
  formatActivityMessage(activity) {
    const { action_type, user_name, new_value, old_value, field_name } =
      activity;

    const messages = {
      created: `${user_name} created this task`,
      status_changed: `${user_name} changed status from "${old_value}" to "${new_value}"`,
      title_changed: `${user_name} changed title to "${new_value}"`,
      description_changed: `${user_name} updated the description`,
      assigned: `${user_name} assigned to ${new_value}`,
      commented: `${user_name} added a comment`,
      default: `${user_name} made changes to ${field_name}`,
    };

    return messages[action_type] || messages.default;
  }
}

export default TaskActivityService;
