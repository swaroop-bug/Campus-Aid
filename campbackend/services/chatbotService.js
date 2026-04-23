// CampusAid Chatbot Service — Multi-provider (xAI Grok + Google Gemini fallback)

const SYSTEM_PROMPT = `You are "CampusAid Assistant", the official AI chatbot for S.S. & B.A.S. College (Somaiya Vidyavihar) AY 2026-27.

You are a highly capable AI assistant designed to help students with ANYTHING they need. This includes:
1. Academic help (programming, math, science, explaining concepts, debugging code, etc.)
2. General knowledge and everyday questions
3. Specific college-related queries

When asked about the college, use the following official data:

COLLEGE DATA (AY 2026-27):
Fees: MSc Data Science Rs 2.5L, MSc CS/IT Rs 1.25L, MSc Biotech Rs 1.5L, MSc Physics/Chemistry/Maths Rs 50K.
Admission: Phase 1 after Sem V (Rs 1000 fee), Phase 2 after Sem VI.
Refund: 100% (15+ days before deadline), 90% (within 15 days), 80% (up to 15 days after), 50% (30 days after), 0% (after 30 days).
Documents: Sem marksheets, SSC/HSC marksheets, Aadhar card, TC, Domicile if applicable.
Hostel: Main Campus, priority to first-year outstation students.
CampusAid Features: Smart Admission Guide, Notes Sharing, Practice Quizzes, Lost & Found.

RESPONSE FORMAT:
- Be clear, concise, and helpful.
- Format responses nicely using Markdown, bullet points, or code blocks where appropriate.

Tone: Professional, highly knowledgeable, friendly, and encouraging.`;

// ── Provider 1: xAI Grok (OpenAI-compatible) ──
async function callGrok(message, apiKey) {
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'grok-3-mini-fast',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      max_tokens: 512,
      temperature: 0.7,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Grok ${res.status}: ${data?.error || data?.code || 'Unknown'}`);

  const text = data?.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty Grok response');
  return text;
}

// ── Provider 2: Google Gemini (REST) ──
const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash'];

async function callGemini(message, apiKey) {
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}` }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn(`⚠️  Gemini ${model} error: ${res.status} — ${data?.error?.message}`);
        continue;
      }

      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) { console.warn(`⚠️  Gemini ${model}: empty response`); continue; }

      console.log(`✅ Success with Gemini ${model}`);
      return text;
    } catch (err) {
      console.warn(`⚠️  Gemini ${model} failed: ${err.message}`);
    }
  }
  throw new Error('All Gemini models failed');
}

// ── Main entry — try Grok first, then Gemini fallback ──
async function sendMessage(message) {
  // Try xAI Grok first
  const xaiKey = process.env.XAI_API_KEY;
  if (xaiKey && xaiKey !== 'FILL_THIS') {
    try {
      console.log('🤖 Trying xAI Grok...');
      const reply = await callGrok(message, xaiKey);
      console.log('✅ Success with Grok');
      return { reply };
    } catch (err) {
      console.warn(`⚠️  Grok failed: ${err.message}`);
    }
  }

  // Fallback to Gemini
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey && geminiKey !== 'FILL_THIS') {
    try {
      console.log('🤖 Falling back to Gemini...');
      const reply = await callGemini(message, geminiKey);
      return { reply };
    } catch (err) {
      console.warn(`⚠️  Gemini fallback failed: ${err.message}`);
    }
  }

  return { reply: "I'm having trouble connecting right now. Please try again in a moment." };
}

module.exports = { sendMessage };
