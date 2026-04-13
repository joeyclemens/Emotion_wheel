export default async function(req) {
if (req.method !== ‘POST’) {
return new Response(‘Method Not Allowed’, { status: 405 });
}

let prompt;
try {
({ prompt } = await req.json());
} catch {
return new Response(‘Bad request’, { status: 400 });
}

if (!prompt) {
return new Response(‘Missing prompt’, { status: 400 });
}

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
return new Response(‘API key not configured’, { status: 500 });
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
  return new Response(err, { status: res.status });
}

const data = await res.json();
const text = data.content?.find(b => b.type === 'text')?.text || '';

return new Response(JSON.stringify({ text }), {
  status: 200,
  headers: { 'Content-Type': 'application/json' }
});
```

} catch (err) {
return new Response(err.message, { status: 500 });
}
}

export const config = {
path: ‘/.netlify/functions/insight’
};
