# AI Task Generation from PRD/TDD

This feature automatically parses Product Requirements Documents (PRD) or Technical Design Documents (TDD) and generates a complete task breakdown with epics, dependencies, and complexity estimates.

## Overview

**Workflow:**
1. User uploads PRD/TDD file (TXT, MD, or PDF)
2. Claude AI analyzes the document
3. AI generates structured task graph:
   - Epics and features
   - Individual tasks with descriptions
   - Dependencies between tasks
   - Complexity estimates
   - Required skills
   - Suggested execution order
4. User reviews and selects tasks to create
5. Tasks are created in the system and can be assigned to team members

## Features

✅ **Document Parsing**
- Supports TXT, Markdown, and PDF formats
- Extracts requirements, features, and constraints
- Identifies technical and functional requirements

✅ **AI Task Breakdown**
- Generates epics from high-level requirements
- Creates granular, actionable tasks
- Identifies task dependencies and blockers
- Assigns complexity (trivial → complex)
- Estimates hours based on complexity

✅ **Team Planning**
- Shows task organization by epic
- Displays required skills for each task
- Visualizes dependencies
- Highlights key risks

✅ **Integration Ready**
- Tasks can be linked to GitHub repos
- Branches auto-created per task
- Codespaces spawnable from task list

## Getting Started

### Step 1: Configure Claude API

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Create an account or sign in
3. Go to **API Keys** → **Create Key**
4. Copy your API key

### Step 2: Add API Key to Environment

Update `.env.local`:

```env
VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
```

### Step 3: Access Task Generator

In your ProjectHub app:
- Navigate to `/task-generator` or find it in the sidebar
- Click **"Upload Document"**

## Using the Task Generator

### Uploading a Document

1. **Select document type**: PRD or TDD
2. **Upload file**: TXT, Markdown, or PDF
3. **Review preview**: Confirm content looks correct
4. **Click "Generate Tasks"**: AI will analyze

### Reviewing Generated Tasks

The AI will show:
- **Summary**: Total tasks, epics, estimated duration
- **Epics**: High-level feature groups
- **Tasks**: Actionable work items with:
  - Title and description
  - Type (frontend, backend, database, etc.)
  - Complexity (easy → complex)
  - Estimated hours
  - Dependencies
  - Required skills
- **Key Risks**: Important considerations

### Creating Tasks

1. **Select tasks**: Check/uncheck which tasks to create
2. **Click "Create Tasks"**: Adds them to your project
3. **View in task list**: Organize, assign, and track

## Example PRD Input

```
# Mobile Banking App

## Overview
Build a mobile banking application with authentication, account management, 
and peer-to-peer payments.

## Features

### 1. User Authentication
- Email/password signup
- Two-factor authentication
- Password recovery
- Session management

### 2. Account Management
- View account balance
- Transaction history
- Account settings
- Profile picture upload

### 3. Payments
- Send money to contacts
- Request money
- Payment history
- Recurring payments

### 4. Security
- End-to-end encryption
- Rate limiting
- Fraud detection
- Audit logging

## Non-Functional Requirements
- Support 100k concurrent users
- <200ms response times
- 99.99% uptime SLA
- GDPR compliance
```

**Generated Tasks (partial):**
- ✅ Epic: User Authentication
  - Task: Design auth schema (backend)
  - Task: Build login UI (frontend)
  - Task: Implement 2FA (backend)
  - Task: Build 2FA UI (frontend)
  - Task: Add password recovery flow (full-stack)

- ✅ Epic: Account Management
  - Task: Design account schema (backend)
  - Task: Build account dashboard (frontend)
  - Task: Implement file upload (backend)
  - ...and more

## Task Properties

### Task Type
- `frontend` — React/UI work
- `backend` — Server/API work
- `database` — Schema, migrations, queries
- `devops` — Infrastructure, deployment
- `testing` — QA, test automation

### Complexity
- **trivial** (1h) — Small fixes, simple UI components
- **easy** (4h) — Basic features, straightforward logic
- **medium** (8h) — Standard features, some integration
- **hard** (16h) — Complex features, heavy lifting
- **complex** (24h) — Very involved, architectural work

### Task Dependencies
Tasks can depend on other tasks. The system will:
- Show dependency chains
- Suggest execution order
- Prevent out-of-order completion (future feature)

## API Reference

### `AIDocumentParser`

```javascript
import AIDocumentParser from '../services/aiDocumentParser';

const parser = new AIDocumentParser();

// Parse a document
const result = await parser.parseDocument(
  documentContent,
  'PRD' // or 'TDD'
);

// result.success: boolean
// result.data: { epics, tasks, summary }
// result.raw: Claude's full response

// Generate task objects
const tasks = await parser.generateTasks(
  result.data.epics,
  result.data.tasks
);
```

### Response Format

```json
{
  "epics": [
    {
      "name": "Authentication",
      "description": "User login and security",
      "priority": "critical"
    }
  ],
  "tasks": [
    {
      "id": "task-123",
      "title": "Design auth schema",
      "description": "Create database schema for users and sessions",
      "epic": "Authentication",
      "type": "backend",
      "priority": "critical",
      "complexity": "medium",
      "dependencies": [],
      "requiredSkills": ["postgresql", "typescript"],
      "order": 1,
      "status": "todo",
      "assignedTo": null,
      "estimatedHours": 8
    }
  ],
  "summary": {
    "totalTasks": 45,
    "estimatedDuration": "8 weeks",
    "requiredTeamSize": "4 developers",
    "keyRisks": ["Complexity of payment processing", "Third-party API dependencies"]
  }
}
```

## Best Practices

### 📝 Writing Good Documents

1. **Be detailed**: More context = better tasks
2. **Be organized**: Use clear sections and hierarchy
3. **Include constraints**: Non-functional requirements matter
4. **List risks**: Help AI identify dependencies
5. **Use consistent terminology**: Avoid ambiguous terms

### ✅ Reviewing Generated Tasks

1. **Check completeness**: Did AI capture all features?
2. **Verify dependencies**: Are blockers correctly identified?
3. **Adjust complexity**: Override if estimates seem off
4. **Add context**: Edit task descriptions if needed
5. **Assign skills**: Review required skills per task

### 🚀 Executing Tasks

1. **Order by dependencies**: Use AI's suggested order
2. **Assign by skills**: Match team members to required skills
3. **Create branches**: Each task gets a git branch
4. **Link Codespaces**: Spawn isolated environments
5. **Track progress**: Update status as work completes

## Limitations

⚠️ **Current Limitations:**

- Claude API calls cost money (check Anthropic pricing)
- Large documents (100KB+) may timeout
- Complex, non-standard formats may parse poorly
- AI can sometimes miss nuanced requirements
- Generated tasks are suggestions, not gospel

✅ **Workarounds:**

1. **Break large docs**: Upload smaller portions separately
2. **Clean documents**: Use simple formatting
3. **Review thoroughly**: Always validate AI output
4. **Iterate**: Re-upload if results aren't good
5. **Manual editing**: Fix tasks after creation

## Troubleshooting

### "Claude API key not configured"
- Check `.env.local` has `VITE_CLAUDE_API_KEY`
- Restart dev server after adding key
- Verify key is valid in Anthropic console

### "Document is too short or invalid"
- Use documents with 100+ characters
- Ensure file isn't corrupted
- Try plain text instead of PDF

### "Failed to parse JSON from Claude response"
- Document may be unclear to AI
- Try clearer, more structured input
- Check Anthropic status page for outages

### "Tasks look incomplete or wrong"
- AI misunderstood the requirements
- Re-upload with clearer, more detailed document
- Manually edit tasks after creation
- Provide feedback to improve future generations

## Future Enhancements

🔮 **Planned Features:**

- [ ] Task refinement UI (batch edit generated tasks)
- [ ] Automatic GitHub branch creation
- [ ] Team member skill tagging
- [ ] Smart task assignment suggestions
- [ ] Dependency enforcement in workflow
- [ ] Task templates and reusable components
- [ ] Multi-document project generation
- [ ] Cost estimation (hours → dollars)
- [ ] Risk scoring and mitigation
- [ ] Agile sprint planning integration

## Next Steps

1. ✅ Get Claude API key
2. ✅ Add to `.env.local`
3. ⏳ Test with sample PRD
4. ⏳ Integrate with GitHub repos
5. ⏳ Auto-spawn Codespaces from tasks

---

**Resources:**
- [Anthropic Claude API](https://console.anthropic.com/)
- [Claude Models Documentation](https://docs.anthropic.com/)
- [Example PRD Template](./examples/sample-prd.md)
