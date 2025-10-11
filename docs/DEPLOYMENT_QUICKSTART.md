# VibeSurf HuggingFace Spaces - Quick Start 🚀

## ⚡ TL;DR

VibeSurf uses **client-server architecture**:
- **Backend**: Deploy to HuggingFace Spaces (this repo's Dockerfile)
- **Frontend**: Chrome extension (users install locally)

## 📦 Deploy Backend in 3 Steps

### 1. Push to HuggingFace
```bash
# Dockerfile is already configured and ready!
git push  # Triggers HuggingFace Spaces rebuild
```

### 2. Add API Keys
In your HuggingFace Space settings → Secrets:
```
OPENAI_API_KEY=sk-...
# Or: ANTHROPIC_API_KEY, GOOGLE_API_KEY, etc.
```

### 3. Wait for Build
- Build takes ~5-10 minutes (first time)
- Your backend will be at: `https://your-username-vibesurf.hf.space`
- Check `/docs` endpoint for API documentation

## 👥 User Setup (One-Time)

Users need to install the Chrome extension and connect it to your backend:

### Install Extension

**Option A: From Chrome Web Store** (if published)
- Search "VibeSurf" → Add to Chrome

**Option B: From Source**
```bash
git clone https://github.com/vvincent1234/VibeSurf.git
# Then load vibe_surf/chrome_extension/ as unpacked extension
```

### Configure Backend URL

1. Open VibeSurf extension in Chrome
2. Go to Settings ⚙️
3. Set Backend URL:
   ```
   https://your-username-vibesurf.hf.space
   ```
4. Save & Test ✅

## ✅ Verify Deployment

**Check backend health:**
```bash
curl https://your-username-vibesurf.hf.space/health
```

**Test API docs:**
```
https://your-username-vibesurf.hf.space/docs
```

**Use extension:**
- Open extension
- Enter task: "What is 2+2?"
- Should get response from backend

## 📚 Full Documentation

- **[HUGGINGFACE_DEPLOYMENT.md](docs/HUGGINGFACE_DEPLOYMENT.md)** - Complete deployment guide
- **[Dockerfile_API](Dockerfile_API)** - Production backend (what Dockerfile uses)
- **[DOCKERFILE_WEB_UI_DEPRECATED.md](docs/DOCKERFILE_WEB_UI_DEPRECATED.md)** - Why web UI doesn't work

## 🎯 Architecture

```
User's Chrome              Your HuggingFace Space
┌─────────────┐           ┌──────────────────┐
│  Extension  │  ──API──▶ │  Backend Server  │
│     UI      │  ◀────────│ (Browser Auto)   │
└─────────────┘           └──────────────────┘
  (Local)                    (Cloud/Dockerfile)
```

## ❓ Common Issues

**"Extension can't connect"**
- Check backend URL in extension settings
- Verify Space is running (check logs)

**"API key errors"**
- Add API keys in Space secrets
- Restart Space after adding secrets

**"Tasks fail"**
- Check Space logs for errors
- Verify API key is valid

## 🎉 That's It!

You now have:
- ✅ Powerful backend running 24/7 in cloud
- ✅ Native Chrome extension for users
- ✅ Full browser automation capabilities
- ✅ Scalable architecture

**Questions?** See [docs/HUGGINGFACE_DEPLOYMENT.md](docs/HUGGINGFACE_DEPLOYMENT.md) for details.
