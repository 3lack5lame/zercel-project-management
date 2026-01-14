import { useState } from 'react';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function CommentForm({ taskId, onCommentAdded }) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (!user?.id) {
      toast.error('Please log in to comment');
      return;
    }

    setIsSubmitting(true);
    try {
      await onCommentAdded({
        task_id: taskId,
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Anonymous',
        user_email: user.email,
        content: content.trim(),
      });

      setContent('');
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Comment error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment... (press Ctrl+Enter to submit)"
          className="w-full rounded-lg border border-gray-600 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-3 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none min-h-24"
          disabled={isSubmitting}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
              handleSubmit(e);
            }
          }}
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setContent('')}
          className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
          disabled={isSubmitting || !content.trim()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
          disabled={isSubmitting || !content.trim()}
        >
          <Send size={16} />
          {isSubmitting ? 'Posting...' : 'Comment'}
        </button>
      </div>
    </form>
  );
}
