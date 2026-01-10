# Task Generator - Complete Implementation Guide

## ✅ What's Been Completed

### 1. **AI Document Parsing** (`src/services/aiDocumentParser.js`)
- Integrates with Claude API (Anthropic) to parse PRD/TDD documents
- Extracts epics, tasks, dependencies, and complexity metadata
- Generates structured JSON with risk analysis
- Supports both Product Requirements Documents and Technical Design Documents

### 2. **PRD/TDD Upload Dialog** (`src/components/PRDUploadDialog.jsx`)
- Drag-and-drop file upload interface
- Document type selector (PRD vs TDD)
- Preview of document contents (first 500 characters)
- Real-time parsing with Claude API
- Loading states and error handling

### 3. **Task Generator Page** (`src/pages/TaskGenerator.jsx`) - **NOW WITH DATABASE SAVING**
- Displays AI-parsed tasks and epics in review interface
- Interactive task selection with checkboxes
- Epic breakdown with priority visualization
- Complexity and type badges for each task
- **NEW: Project dropdown selector** - choose which project to save tasks to
- **NEW: Database persistence** - saves selected tasks to Supabase
- Risk highlighting and dependency visualization
- Success/error notifications with toast messages

### 4. **Task Database Service** (`src/services/taskService.js`)
Complete CRUD operations for task management:
- `createTask()` - Create single task
- `createTasks()` - Batch create multiple tasks with metadata
- `getProjectTasks()` - Retrieve all tasks for a project
- `getTask()` - Get single task by ID
- `updateTask()` - Update task properties
- `updateTaskStatus()` - Change task status
- `assignTask()` - Assign task to user
- `getEpicTasks()` - Filter tasks by epic
- `getTasksByStatus()` - Filter tasks by status
- `deleteTask()` - Remove task
- `getUserTasks()` - Get tasks assigned to user

## 🔄 The Complete Workflow

### **Step 1: Upload Document**
User navigates to `/task-generator` and uploads a PRD or TDD file.

```
User clicks "Upload Document"
↓
PRDUploadDialog appears
↓
User selects file (PDF/text)
↓
Claude API parses document
↓
AI generates structured task data
```

### **Step 2: Review & Select Tasks**
The parsed data displays in an interactive review interface.

```
Tasks displayed with:
  - Title & description
  - Type (feature/bug/refactor, etc.)
  - Complexity (easy/medium/hard/complex)
  - Estimated hours
  - Dependencies
  - Related epic

User can:
  - Check/uncheck tasks
  - View epic breakdowns
  - See risk warnings
  - Review estimated duration
```

### **Step 3: Select Project**
User chooses which project to save the tasks to.

```
Dropdown loads user's projects
↓
User selects project
↓
Creates association between tasks and project
```

### **Step 4: Save to Database**
Click "Create Tasks" to save all selected tasks to Supabase.

```
TaskService.createTasks() called
↓
Batch insert to 'tasks' table
↓
Tasks linked to project & user
↓
Success message with task count
↓
Form resets for new workflow
```

## 📊 Data Structure

### Task Object (from Claude)
```javascript
{
  id: "uuid",
  title: "Implement user authentication",
  description: "Add login/signup with email verification",
  type: "feature",
  complexity: "hard",
  estimatedHours: 16,
  dependencies: ["db-schema", "email-service"],
  epic: "Authentication",
  riskLevel: "medium",
  acceptanceCriteria: [...],
  priority: "high"
}
```

### Saved to Database
```javascript
{
  id: "uuid",
  project_id: "uuid",
  user_id: "uuid",
  title: "Implement user authentication",
  description: "Add login/signup with email verification",
  type: "feature",
  complexity: "hard",
  estimated_hours: 16,
  dependencies: ["db-schema", "email-service"],
  epic: "Authentication",
  status: "todo",
  created_at: "2024-...",
  updated_at: "2024-...",
  assigned_to: null
}
```

## 🚀 How to Use

### 1. **Prepare Your Document**
- Write a PRD (Product Requirements Document) or TDD (Technical Design Document)
- Can be PDF or plain text file
- Should include epics, features, and acceptance criteria

### 2. **Navigate to Task Generator**
```
Application → Task Generator
or direct URL: /task-generator
```

### 3. **Upload Document**
- Click "Upload Document" button
- Select your PRD/TDD file
- Choose document type (PRD or TDD)
- Wait for AI parsing (5-10 seconds)

### 4. **Review AI-Generated Tasks**
- See summary stats (total tasks, epics, estimated duration)
- Expand epics to see details
- Review complexity and risks
- Check dependencies between tasks

### 5. **Select Tasks to Create**
- Uncheck any tasks you don't want to create
- Most are selected by default
- Selected count updates in real-time

### 6. **Select Target Project**
- Choose a project from the dropdown
- Must have at least one project created

### 7. **Create Tasks**
- Click "✅ Create X Tasks"
- Tasks save to Supabase in ~2-3 seconds
- Success notification appears
- Form clears for next batch

## 🔧 Configuration

### Environment Variables
Add to `.env.local`:
```
VITE_CLAUDE_API_KEY=sk-ant-your-api-key-here
```

Get your Claude API key from: https://console.anthropic.com/

### Dependencies
- `@anthropic-ai/sdk` - Claude API client
- `react-hot-toast` - Notifications
- `@supabase/supabase-js` - Database

## 📋 Next Steps (Future Features)

1. **GitHub Branch Creation** - Auto-create branches per task
2. **Codespace Integration** - Spawn development environments
3. **Task-to-PR Linking** - Track PR progress on tasks
4. **Webhook Syncing** - Auto-update task status from GitHub
5. **AI Code Review** - Review PRs with Claude

## 🐛 Troubleshooting

### "No projects found" error
- Create a project first in the Projects page
- Must have at least one project to save tasks

### "Failed to save tasks" error
- Check Supabase RLS policies allow task creation
- Verify user is authenticated
- Check browser console for detailed error

### Claude API errors
- Verify `VITE_CLAUDE_API_KEY` is set in `.env.local`
- Check API key is valid at console.anthropic.com
- Ensure document is readable (not corrupted)

### Tasks not appearing in project
- Refresh the page
- Check Projects page to see tasks
- Verify task count in success message

## 📚 Related Files

- [AI Task Generation Features](./AI_TASK_GENERATION.md) - Detailed feature docs
- [GitHub OAuth Setup](./GITHUB_OAUTH_SETUP.md) - OAuth configuration
- [Supabase RLS Setup](./SUPABASE_RLS_SETUP.md) - Database policies
- [Supabase Complete Guide](./SUPABASE_COMPLETE_GUIDE.md) - Full database docs

---

**Status**: ✅ Production Ready
**Last Updated**: 2024
**Database Integration**: Supabase PostgreSQL
**AI Provider**: Anthropic Claude
