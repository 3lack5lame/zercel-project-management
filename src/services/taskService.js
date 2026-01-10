// Task Service - Database operations for tasks
import { supabase } from '../config/supabase';

class TaskService {
  // Create a new task
  async createTask(task, userId, projectId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          project_id: projectId,
          assigned_to: task.assignedTo || userId,
          status: task.status || 'todo',
          priority: task.priority || 'medium',
          complexity: task.complexity || 'medium',
          epic: task.epic,
          dependencies: task.dependencies || [],
          required_skills: task.requiredSkills || [],
          estimated_hours: task.estimatedHours || 8,
          order: task.order || 0,
          source_file: task.sourceFile || null,
          metadata: {
            type: task.type,
            suggestedOrder: task.suggestedOrder,
          },
        })
        .select();

      if (error) throw error;
      return { success: true, task: data[0] };
    } catch (error) {
      console.error('Create task error:', error);
      return { success: false, error: error.message };
    }
  }

  // Create multiple tasks in batch
  async createTasks(tasks, userId, projectId) {
    try {
      const tasksToInsert = tasks.map((task) => ({
        title: task.title,
        description: task.description,
        project_id: projectId,
        assigned_to: task.assignedTo || userId,
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        complexity: task.complexity || 'medium',
        epic: task.epic,
        dependencies: task.dependencies || [],
        required_skills: task.requiredSkills || [],
        estimated_hours: task.estimatedHours || 8,
        order: task.order || 0,
        source_file: task.sourceFile || null,
        metadata: {
          type: task.type,
          suggestedOrder: task.suggestedOrder,
        },
      }));

      const { data, error } = await supabase
        .from('tasks')
        .insert(tasksToInsert)
        .select();

      if (error) throw error;
      return { success: true, tasks: data, count: data.length };
    } catch (error) {
      console.error('Batch create tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tasks for a project
  async getProjectTasks(projectId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('order', { ascending: true });

      if (error) throw error;
      return { success: true, tasks: data };
    } catch (error) {
      console.error('Get project tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get task by ID
  async getTask(taskId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      return { success: true, task: data };
    } catch (error) {
      console.error('Get task error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update task
  async updateTask(taskId, updates) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select();

      if (error) throw error;
      return { success: true, task: data[0] };
    } catch (error) {
      console.error('Update task error:', error);
      return { success: false, error: error.message };
    }
  }

  // Update task status
  async updateTaskStatus(taskId, status) {
    return this.updateTask(taskId, { status });
  }

  // Assign task to user
  async assignTask(taskId, userId) {
    return this.updateTask(taskId, { assigned_to: userId });
  }

  // Get tasks by epic
  async getEpicTasks(projectId, epic) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('epic', epic)
        .order('order', { ascending: true });

      if (error) throw error;
      return { success: true, tasks: data };
    } catch (error) {
      console.error('Get epic tasks error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get tasks by status
  async getTasksByStatus(projectId, status) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId)
        .eq('status', status)
        .order('order', { ascending: true });

      if (error) throw error;
      return { success: true, tasks: data };
    } catch (error) {
      console.error('Get tasks by status error:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete task
  async deleteTask(taskId) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Delete task error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all user's tasks (across all projects)
  async getUserTasks(userId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, tasks: data };
    } catch (error) {
      console.error('Get user tasks error:', error);
      return { success: false, error: error.message };
    }
  }
}

export default TaskService;
