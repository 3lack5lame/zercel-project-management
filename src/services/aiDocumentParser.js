// AI Document Parser Service
// Parses PRD/TDD documents and generates structured task graphs

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';
const OPENROUTER_MODEL = import.meta.env.VITE_OPENROUTER_MODEL || 'claude-3.5-mini';
const OPENROUTER_URL = 'https://api.openrouter.ai/v1/chat/completions';

const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY || '';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

class AIDocumentParser {
  constructor() {
    if (!OPENROUTER_API_KEY && !CLAUDE_API_KEY) {
      console.warn('No AI API key found. Set VITE_OPENROUTER_API_KEY or VITE_CLAUDE_API_KEY to enable parsing.');
    }
  }

  // Parse PRD/TDD document and generate task breakdown
  async parseDocument(documentContent, documentType = 'PRD') {
    // Prefer OpenRouter if configured (acts as a free proxy to multiple models)
    if (OPENROUTER_API_KEY) {
      return this._parseWithOpenRouter(documentContent, documentType);
    }

    if (!CLAUDE_API_KEY) {
      throw new Error('No AI API key configured (VITE_OPENROUTER_API_KEY or VITE_CLAUDE_API_KEY)');
    }

    const prompt = `
You are an expert software engineer. Analyze the following ${documentType} (${documentType === 'PRD' ? 'Product Requirements Document' : 'Technical Design Document'}) and break it down into a structured task graph.

For each task, provide:
- title: Clear, actionable task title
- description: Detailed description
- epic: Which epic this belongs to (e.g., "Authentication", "Dashboard", "API")
- type: 'frontend' | 'backend' | 'devops' | 'database' | 'testing'
- priority: 'critical' | 'high' | 'medium' | 'low'
- estimatedComplexity: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex'
- dependencies: array of task titles this depends on
- requiredSkills: array of skill tags (e.g., ['react', 'typescript', 'api'])
- suggestedOrder: numerical order for execution

Return as valid JSON with structure:
{
  "epics": [
    {
      "name": "Epic Name",
      "description": "...",
      "priority": "high"
    }
  ],
  "tasks": [
    {
      "title": "Task Title",
      "description": "...",
      "epic": "Epic Name",
      "type": "frontend",
      "priority": "high",
      "estimatedComplexity": "medium",
      "dependencies": [],
      "requiredSkills": ["react"],
      "suggestedOrder": 1
    }
  ],
  "summary": {
    "totalTasks": 0,
    "estimatedDuration": "weeks",
    "requiredTeamSize": "X developers",
    "keyRisks": []
  }
}

Document to parse:
${documentContent}
`;

    // Fallback to Claude if OpenRouter not configured
    return this._parseWithClaude(documentContent, documentType);
  }

  async _parseWithOpenRouter(documentContent, documentType) {
    const prompt = this._buildPrompt(documentContent, documentType);

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        },
        body: JSON.stringify({
          model: OPENROUTER_MODEL,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 4096,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error(`OpenRouter API error: ${err}`);
      }

      const data = await response.json();
      // OpenRouter follows OpenAI-like response: choices[0].message.content
      const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON from OpenRouter response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed, raw: content };
    } catch (error) {
      console.error('OpenRouter parsing error:', error);
      throw error;
    }
  }

  async _parseWithClaude(documentContent, documentType) {
    const prompt = this._buildPrompt(documentContent, documentType);
    try {
      const response = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4096,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const content = data.content[0].text;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Failed to parse JSON from Claude response');
      }
      const parsed = JSON.parse(jsonMatch[0]);
      return { success: true, data: parsed, raw: content };
    } catch (error) {
      console.error('Document parsing error:', error);
      throw error;
    }
  }

  _buildPrompt(documentContent, documentType) {
    return `\nYou are an expert software engineer. Analyze the following ${documentType} (${documentType === 'PRD' ? 'Product Requirements Document' : 'Technical Design Document'}) and break it down into a structured task graph.\n\nFor each task, provide:\n- title: Clear, actionable task title\n- description: Detailed description\n- epic: Which epic this belongs to (e.g., "Authentication", "Dashboard", "API")\n- type: 'frontend' | 'backend' | 'devops' | 'database' | 'testing'\n- priority: 'critical' | 'high' | 'medium' | 'low'\n- estimatedComplexity: 'trivial' | 'easy' | 'medium' | 'hard' | 'complex'\n- dependencies: array of task titles this depends on\n- requiredSkills: array of skill tags (e.g., ['react', 'typescript', 'api'])\n- suggestedOrder: numerical order for execution\n\nReturn as valid JSON with structure:\n{\n  "epics": [ ... ],\n  "tasks": [ ... ],\n  "summary": { ... }\n}\n\nDocument to parse:\n${documentContent}`;
  }

  // Generate tasks from parsed document
  async generateTasks(epics, tasks) {
    return tasks.map((task, index) => ({
      id: `task-${Date.now()}-${index}`,
      title: task.title,
      description: task.description,
      epic: task.epic,
      type: task.type,
      priority: task.priority,
      complexity: task.estimatedComplexity,
      dependencies: task.dependencies || [],
      requiredSkills: task.requiredSkills || [],
      order: task.suggestedOrder || index + 1,
      status: 'todo',
      assignedTo: null,
      createdAt: new Date().toISOString(),
      estimatedHours: this.complexityToHours(task.estimatedComplexity),
    }));
  }

  // Convert complexity to estimated hours
  complexityToHours(complexity) {
    const estimates = {
      trivial: 1,
      easy: 4,
      medium: 8,
      hard: 16,
      complex: 24,
    };
    return estimates[complexity] || 8;
  }

  // Validate document structure
  isValidDocument(content) {
    return content && content.length > 100; // Basic validation
  }
}

export default AIDocumentParser;
