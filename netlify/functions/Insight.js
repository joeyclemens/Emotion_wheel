exports.handler = async function(event) {
if (event.httpMethod !== ‘POST’) {
return { statusCode: 405, body: ‘Method Not Allowed’ };
}

let prompt;
try {
({ prompt } = JSON.parse(event.body));
} catch {
return { statusCode: 400, body: ‘Bad request’ };
}

if (!prompt) {
return { statusCode: 400, body: ‘Missing prompt’ };
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
return { statusCode: 500, body: ‘API key not configured’ };
}

try {
const res = await fetch(‘https://api.anthropic.com/v1/messages’, {
method: ‘POST’,
headers: {
‘Content-Type’: ‘application/json’,
‘x-api-key’: apiKey,
‘anthropic-version’: ‘2023-06-01’
},
body: JSON.stringify({
model: ‘claude-sonnet-4-20250514’,
max_tokens: 1000,
system: ‘You help people with alexithymia understand their emotions. Be warm, grounded, and concrete. Never use therapy jargon or generic advice.’,
messages: [{ role: ‘user’, content: prompt }]
})
});

```
if (!res.ok) {
  const err = await res.text();
  return { statusCode: res.status, body: err };
}

const data = await res.json();
const text = data.content?.find(b => b.type === 'text')?.text || '';

return {
  statusCode: 200,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text })
};
```

} catch (err) {
return { statusCode: 500, body: err.message };
}
};
