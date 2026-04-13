const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware - Railway can handle 50MB no problem
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// =====================================================
// API ROUTE: Compare with Claude (receives base64)
// =====================================================
app.post('/api/compare', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

const apiKey = process.env.ANTHROPIC_API_KEY || process.env.RAILWAY_ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const body = req.body;

    if (!body.messages || !Array.isArray(body.messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    // Log payload size for debugging
    const payloadSize = JSON.stringify(body).length;
    console.log(`[${new Date().toISOString()}] API Payload size: ${(payloadSize / 1024 / 1024).toFixed(2)}MB`);

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
    });

    const text = await response.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error('JSON Parse Error:', text.slice(0, 300));
      return res.status(500).json({ 
        error: 'Anthropic response parse failed: ' + text.slice(0, 200) 
      });
    }

    if (!response.ok) {
      console.error('Claude API Error:', data);
      return res.status(response.status).json({ 
        error: data?.error?.message || 'API error ' + response.status 
      });
    }

    console.log('[' + new Date().toISOString() + '] Claude API call successful');
    return res.status(200).json(data);

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: err.message });
  }
});

// =====================================================
// Health check endpoint
// =====================================================
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =====================================================
// Root endpoint (optional)
// =====================================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Visit: http://localhost:${PORT}`);
});
