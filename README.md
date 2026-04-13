# Rhydburg Pharmaceuticals Ltd. — Change Control AI Tool

## Deploy on Vercel (Step by Step)

### Step 1 — GitHub par upload karo
1. GitHub.com → New Repository → Name: `rhydburg-change-control`
2. Is poore folder ka content upload karo (api/, public/, vercel.json, package.json)

### Step 2 — Vercel par deploy karo
1. vercel.com → "Add New Project"
2. GitHub se `rhydburg-change-control` repo select karo
3. "Deploy" dabao

### Step 3 — API Key add karo (IMPORTANT)
1. Vercel Dashboard → Project → Settings → Environment Variables
2. Add karo:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (tumhari actual key)
3. "Save" karo
4. Project → Deployments → "Redeploy" karo

### Step 4 — Done!
Tumhara URL milega: `https://rhydburg-change-control.vercel.app`
Koi login nahi, koi API key UI mein nahi — sab server-side safe.

## Project Structure
```
rhydburg-cc/
├── api/
│   └── compare.js      ← Vercel serverless function (API key yahan safe hai)
├── public/
│   └── index.html      ← Frontend UI
├── vercel.json         ← Routing config
└── package.json
```
