import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2, Edit2, Check, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function CommentsList({ comments, currentUserId, onEditComment, onDeleteComment, isLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleEditStart = (comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleEditSave = (comment) => {
    if (editContent.trim()) {
      onEditComment(comment.id, editContent.trim());
      setEditingId(null);
    }
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 animate-pulse h-20" />
        ))}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-sm transition"
        >
          {/* Comment Header */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                {comment.user_name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {comment.user_name || 'Anonymous'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  {comment.is_edited && ' (edited)'}
                </p>
              </div>
            </div>

            {/* Edit/Delete Buttons */}
            {currentUserId === comment.user_id && (
              <div className="flex gap-2">
                {editingId !== comment.id ? (
                  <>
                    <button
                      onClick={() => handleEditStart(comment)}
                      className="p-1.5 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-1.5 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : null}
              </div>
            )}
          </div>

          {/* Comment Content */}
          {editingId === comment.id ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 p-3 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                rows={3}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleEditCancel}
                  className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => handleEditSave(comment)}
                  className="p-1.5 text-indigo-600 hover:text-indigo-700 dark:hover:text-indigo-400 transition"
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
