# Task Comments Feature - Setup & Testing Guide

## Overview
Task Comments & Discussion feature enables team members to collaborate on tasks by adding comments, editing, deleting, and receiving real-time updates. This guide walks through the complete setup.

## Components Created

### 1. Database Schema
**File:** `db/task_comments_schema.sql`

Creates the `task_comments` table with:
- `id` (UUID Primary Key)
- `task_id` (Foreign key to tasks)
- `user_id`, `user_name`, `user_email` (User attribution)
- `content` (Comment text)
- `created_at` (Timestamp)
- `is_edited` (Track modifications)
- RLS policies for secure access
- Trigger to update `tasks.comments_count`

### 2. Backend Service
**File:** `src/services/taskCommentsService.js`

Provides these methods:
- `getTaskComments(taskId)` - Fetch all comments for a task
- `createComment(taskId, userId, userName, email, content)` - Add new comment
- `updateComment(commentId, newContent)` - Edit existing comment
- `deleteComment(commentId, taskId)` - Remove comment
- `subscribeToComments(taskId, callback)` - Real-time updates via Supabase

### 3. UI Components

**CommentForm** (`src/components/CommentForm.jsx`)
- Textarea input with validation
- Submit button and loading state
- Keyboard shortcut: Ctrl+Enter to submit
- Integrates with TaskCommentsService

**CommentsList** (`src/components/CommentsList.jsx`)
- Displays all comments for a task
- Shows user avatar, name, timestamp
- Edit button (inline editing)
- Delete button (with confirmation)
- Loading skeleton state

### 4. Page Integration
**TaskDetails** (`src/pages/TaskDetails.jsx`)
- Imports TaskCommentsService
- Fetches comments on mount
- Handles CRUD operations
- Sets up real-time subscriptions
- Displays comment count

## Setup Instructions

### Step 1: Execute Database Migration
1. Go to your **Supabase Dashboard** → Project → SQL Editor
2. Create new query or paste content from `db/task_comments_schema.sql`
3. Execute the migration
4. Verify: Check if `task_comments` table appears in Tables view

**What this does:**
- Creates `task_comments` table
- Adds RLS (Row Level Security) policies
- Creates trigger to update comment counts
- Indexes for performance

### Step 2: Update Environment Variables (if needed)
Ensure your `.env` has:
```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

These should already be set from your Supabase configuration.

### Step 3: Verify Component Integration
✅ **Already Done:**
- TaskCommentsService imported in TaskDetails
- CommentForm and CommentsList components integrated
- CRUD handlers wired up
- Real-time subscriptions enabled

## Testing the Feature

### Test Case 1: Create Comment
1. Navigate to any project task
2. Scroll to "Task Discussion" section
3. Type a comment in the textarea
4. Click "Post" or press Ctrl+Enter
5. **Expected:** Comment appears immediately with your name and timestamp

### Test Case 2: Edit Comment
1. Hover over your comment
2. Click the Edit (pencil) icon
3. Modify the text
4. Click Save
5. **Expected:** Comment updates, shows "(edited)" label

### Test Case 3: Delete Comment
1. Hover over your comment
2. Click Delete icon
3. Confirm deletion
4. **Expected:** Comment disappears, count decreases

### Test Case 4: Real-time Updates
1. Open same task in two browser windows/tabs
2. Add comment in one window
3. Watch the other window for automatic update
4. **Expected:** New comment appears without refresh

### Test Case 5: Validation
1. Try to submit empty comment
2. **Expected:** Toast error "Comment cannot be empty"

## Features

### ✅ What's Included
- [x] Create comments on tasks
- [x] Edit your own comments
- [x] Delete your own comments
- [x] View all comments with timestamps
- [x] Real-time updates (live sync across tabs)
- [x] User attribution (name, email, avatar)
- [x] Comment count in task header
- [x] Loading states and error handling
- [x] Validation (no empty comments)
- [x] Dark mode styling
- [x] Mobile responsive design

### 🔄 How to Extend
If you want to add more features later:

**Activity Feed (logs all changes):**
```javascript
// In TaskDetailsActivity.jsx
const fetchActivityLog = async () => {
  const { data } = await supabase
    .from('task_activity')
    .select('*')
    .eq('task_id', taskId)
    .order('created_at', { ascending: false });
};
```

**Mention Users (@username):**
Update CommentForm to detect @ mentions and link to users

**Emoji Reactions:**
Add reactions table and UI in CommentsList

**Threaded Replies:**
Add `parent_comment_id` field to task_comments for nested discussions

## Database Schema Details

```sql
-- Main table structure
CREATE TABLE task_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  is_edited BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS Policy: Users can see all comments but only edit/delete their own
-- Trigger: Updates task.comments_count whenever a comment is added/deleted
```

## Troubleshooting

### Issue: "Table 'task_comments' does not exist"
**Solution:** Run the migration in Supabase SQL Editor (Step 1)

### Issue: Comments not saving
**Solution:** 
1. Check Supabase RLS policies (should allow insert/select)
2. Verify authentication (user.id must be set)
3. Check browser console for errors

### Issue: Real-time not updating
**Solution:**
- Refresh the page manually
- Check Supabase Realtime is enabled
- Verify table has realtime publication enabled

### Issue: "Permission denied" error
**Solution:** RLS policies may be too strict. Check:
1. Insert policy allows authenticated users
2. Select policy allows viewing all comments
3. Update/Delete policies allow modifying own comments

## Performance Optimization

For tasks with many comments (100+):
1. Implement pagination: `LIMIT 20 OFFSET 0`
2. Lazy load older comments on scroll
3. Add comment search functionality
4. Cache recent comments client-side

## Security Notes

✅ **Implemented:**
- RLS policies enforce user ownership
- Users can only edit/delete their own comments
- Authentication required via `user.id`
- SQL injection prevented (parameterized queries)

⚠️ **Future Considerations:**
- Add rate limiting (max 10 comments/minute per user)
- Add moderation flags for abuse
- Add soft delete (preserve history)
- Add audit log

## Next Steps

1. ✅ **Database Migration** - Execute SQL schema
2. ✅ **Component Integration** - Already wired up
3. 📝 **Testing** - Run test cases above
4. 🚀 **Deploy** - Push to production
5. 📊 **Monitor** - Check Supabase logs for errors

## Support

For issues or questions:
1. Check browser console (F12 → Console tab)
2. Check Supabase logs (Dashboard → Logs)
3. Verify RLS policies in Supabase (Dashboard → Authentication → Policies)
4. Check git history: `git log --oneline | grep comment`
