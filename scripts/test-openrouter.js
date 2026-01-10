import dotenv from 'dotenv';
dotenv.config({ path: './.env.local' });

const OPENROUTER_API_KEY = process.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.VITE_OPENROUTER_MODEL || 'claude-3.5-mini';
const OPENROUTER_URL = 'https://api.openrouter.ai/v1/chat/completions';

if (!OPENROUTER_API_KEY) {
  console.error('VITE_OPENROUTER_API_KEY not set in .env.local');
  process.exit(1);
}

async function runTest() {
  const prompt = `Return a JSON object with one epic and one task for a short PRD. Example:\n{ "epics": [{"name":"Auth","description":"Auth epic","priority":"high"}], "tasks": [{"title":"Add login","description":"Implement login","epic":"Auth","type":"backend","priority":"high","estimatedComplexity":"medium","dependencies":[],"requiredSkills":["node","jwt"],"suggestedOrder":1}], "summary": {"totalTasks":1}}`;

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('OpenRouter error:', text);
    process.exit(2);
  }

  const data = await res.json();
  console.log('OpenRouter response (raw):', JSON.stringify(data.choices?.[0] || data, null, 2));
  const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || '';
  console.log('\nExtracted content:\n', content);
}

runTest().catch((e) => {
  console.error('Test failed', e);
  process.exit(1);
});
