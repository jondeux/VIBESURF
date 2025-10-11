# VibeSurf HuggingFace Spaces Deployment Guide

## 🎯 Architecture

VibeSurf uses a **client-server architecture**:

```
┌─────────────────────────────────────────────────────┐
│ User's Local Machine                                 │
│                                                      │
│  ┌────────────────────────────────────┐            │
│  │  Chrome Browser                     │            │
│  │                                     │            │
│  │  ┌──────────────────────────────┐  │            │
│  │  │ VibeSurf Chrome Extension    │  │            │
│  │  │ (UI + Controls)              │  │            │
│  │  └──────────────────────────────┘  │            │
│  └────────────────────────────────────┘            │
│                    │                                │
│                    │ HTTPS API Calls                │
│                    ▼                                │
└────────────────────────────────────────────────────┘
                     │
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ HuggingFace Spaces (Cloud)                          │
│                                                      │
│  ┌────────────────────────────────────────────────┐│
│  │ VibeSurf Backend (Dockerfile_API)              ││
│  │                                                 ││
│  │ • FastAPI Server (Port 7860)                   ││
│  │ • Browser Automation Engine                    ││
│  │ • Task Processing                              ││
│  │ • Database                                     ││
│  └────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

## 📦 Deployment Steps

### Step 1: Deploy Backend to HuggingFace Spaces

1. **Copy the production Dockerfile**:
   ```bash
   cp Dockerfile_API Dockerfile
   ```

2. **Commit and push to your repo**:
   ```bash
   git add Dockerfile
   git commit -m "Deploy VibeSurf backend to HuggingFace Spaces"
   git push
   ```

3. **Configure HuggingFace Space**:
   - Go to https://huggingface.co/spaces
   - Create new Space or link existing repo
   - Set Space type: **Docker**
   - Connect your GitHub repository
   - Add secrets in Space settings:
     - `OPENAI_API_KEY` (required)
     - `ANTHROPIC_API_KEY` (optional)
     - `GOOGLE_API_KEY` (optional)
     - Or any other LLM API keys you want to use

4. **Wait for build** (5-10 minutes first time)

5. **Verify deployment**:
   - Open your Space URL: `https://your-username-vibesurf.hf.space`
   - You should see: "VibeSurf Backend API" message
   - Check API docs: `https://your-username-vibesurf.hf.space/docs`

### Step 2: Install Chrome Extension Locally

Since the UI is a Chrome extension, users need to install it locally:

#### Option A: Install from Chrome Web Store (if published)
1. Visit VibeSurf on Chrome Web Store
2. Click "Add to Chrome"
3. Done!

#### Option B: Load Unpacked Extension (Development)

1. **Clone VibeSurf repository**:
   ```bash
   git clone https://github.com/vvincent1234/VibeSurf.git
   cd VibeSurf
   ```

2. **Open Chrome Extensions**:
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the extension**:
   - Click "Load unpacked"
   - Navigate to: `VibeSurf/vibe_surf/chrome_extension/`
   - Select the folder
   - Extension installed! ✅

### Step 3: Configure Extension to Use Your Backend

1. **Open extension settings**:
   - Click VibeSurf extension icon in Chrome
   - Click settings ⚙️ icon

2. **Set backend URL**:
   - Navigate to "Backend Settings" or "Server Configuration"
   - Enter your HuggingFace Space URL:
     ```
     https://your-username-vibesurf.hf.space
     ```
   - Save settings

3. **Test connection**:
   - Extension should show "Connected" status
   - Try a simple task: "What is 2+2?"

## 🔧 Backend Configuration (Dockerfile_API)

The production Dockerfile includes:

### System Components
- ✅ **Python 3.12** - Optimal AI application compatibility
- ✅ **Chromium** - Browser automation (headless)
- ✅ **Xvfb** - Virtual display for headless browser
- ✅ **FastAPI + Uvicorn** - Web server and API
- ✅ **SQLite Database** - Task and session storage

### Environment Variables
```env
# HuggingFace Spaces provides these automatically
SPACE_HOST=your-space.hf.space
PORT=7860

# You configure these in Space secrets
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=...
GOOGLE_API_KEY=...

# Automatically configured by Dockerfile
VIBESURF_BACKEND_PORT=7860
BROWSER_USE_LOGGING_LEVEL=info
IN_DOCKER=true
DISPLAY=:99
```

### Endpoints Available

| Endpoint | Purpose | Access |
|----------|---------|--------|
| `/` | Backend status | Public |
| `/docs` | API documentation (Swagger UI) | Public |
| `/health` | Health check | Public |
| `/api/tasks` | Task management | API |
| `/api/agent` | Agent operations | API |
| `/api/browser` | Browser control | API |
| `/api/config` | Configuration | API |
| `/api/files` | File management | API |
| `/api/voices` | Voice features | API |
| `/api/activity` | Activity logs | API |

## 🎮 User Workflow

### For End Users:

1. **Install Chrome extension** (one-time)
2. **Configure backend URL** (one-time)
3. **Use VibeSurf**:
   - Open extension in Chrome
   - Enter tasks in the UI
   - Backend processes tasks in cloud
   - Results appear in extension

### What Happens Behind the Scenes:

```
User types task in extension
      ↓
Extension sends HTTP POST to:
https://your-space.hf.space/api/tasks
      ↓
Backend receives task
      ↓
Backend launches browser automation
      ↓
Browser performs actions in cloud
      ↓
Results sent back via API
      ↓
Extension displays results
```

## 🌟 Benefits of This Architecture

### ✅ Advantages

1. **Powerful Backend**:
   - Runs in cloud with full resources
   - No local resource consumption
   - Works on any computer (even low-end)

2. **Familiar UI**:
   - Native Chrome extension
   - Feels like part of browser
   - No separate application to install

3. **Always Available**:
   - Backend runs 24/7 on HuggingFace
   - No need to start local server
   - Access from anywhere

4. **Easy Updates**:
   - Backend updates via git push
   - Extension updates via Chrome Web Store (or manual)
   - No user intervention needed

5. **Scalable**:
   - Can handle multiple users
   - HuggingFace auto-scales resources
   - Cost-effective

### ⚠️ Limitations

1. **Requires Chrome**:
   - UI only works in Chrome browser
   - Extension not available on Firefox/Safari/Edge

2. **Internet Required**:
   - Extension needs to reach backend
   - Won't work offline

3. **Extension Installation**:
   - Users must install extension manually
   - Not as seamless as pure web app

## 🔐 Security Considerations

### API Keys

- **Stored in HuggingFace Secrets** (server-side)
- **Never exposed to users**
- **Encrypted by HuggingFace**

### Browser Automation

- **Runs in isolated container**
- **Headless mode (no GUI)**
- **Sandboxed by Docker**

### User Data

- **SQLite database in container** (ephemeral)
- **No persistent user data by default**
- **Add volume mount for persistence** (optional)

## 📊 Monitoring

### Check Backend Health

```bash
curl https://your-space.hf.space/health
```

**Expected response**:
```json
{
  "status": "healthy",
  "backend": "running",
  "database": "connected",
  "browser": "available"
}
```

### View Logs

1. Go to HuggingFace Space settings
2. Click "Logs" tab
3. See real-time backend logs

### Check API Documentation

Visit: `https://your-space.hf.space/docs`

Interactive Swagger UI with:
- All endpoints documented
- Try API calls directly
- See request/response schemas

## 🐛 Troubleshooting

### Backend Issues

**Problem**: Space won't start
- **Check**: Build logs in HuggingFace
- **Fix**: Verify Dockerfile syntax, check dependencies

**Problem**: API key errors
- **Check**: Space secrets configuration
- **Fix**: Add required API keys in Space settings

**Problem**: Browser automation fails
- **Check**: Logs for Chrome/Chromium errors
- **Fix**: Usually auto-recovers; restart Space if needed

### Extension Issues

**Problem**: Can't connect to backend
- **Check**: Backend URL in extension settings
- **Fix**: Ensure URL is correct: `https://your-space.hf.space`

**Problem**: Extension not loading
- **Check**: Chrome extensions page (`chrome://extensions/`)
- **Fix**: Reload extension, check for errors

**Problem**: Tasks fail
- **Check**: Backend logs in HuggingFace
- **Fix**: Check API key validity, verify task format

## 🚀 Advanced Configuration

### Custom Domain (Optional)

HuggingFace Spaces allows custom domains:
1. Go to Space settings
2. Configure custom domain
3. Update extension backend URL

### Persistent Storage (Optional)

Add volume mount in Dockerfile:
```dockerfile
VOLUME /home/user/app/data
```

Then configure in HuggingFace Space settings.

### Multiple Environments

Deploy multiple Spaces:
- **Production**: `vibesurf-prod.hf.space`
- **Staging**: `vibesurf-staging.hf.space`
- **Development**: `vibesurf-dev.hf.space`

Users switch backend URL in extension settings.

## 📈 Scaling

### Concurrent Users

- HuggingFace Spaces auto-scales
- Each user gets isolated task queue
- Browser sessions managed efficiently

### Resource Limits

Default Space resources:
- **CPU**: 2 cores
- **RAM**: 16 GB
- **Storage**: 50 GB (ephemeral)

Upgrade to:
- **CPU**: Up to 8 cores
- **RAM**: Up to 32 GB
- **GPU**: Optional (for AI models)

## 💡 Tips & Best Practices

1. **Use API keys from secrets** (never hardcode)
2. **Monitor Space logs** regularly
3. **Update dependencies** periodically
4. **Test backend** before distributing to users
5. **Document backend URL** for users
6. **Set up health checks** for monitoring
7. **Use descriptive Space name** (e.g., `vibesurf-production`)

## 🎯 Summary

**For Deployment**:
```bash
cp Dockerfile_API Dockerfile
git add Dockerfile
git commit -m "Deploy VibeSurf backend"
git push
```

**For Users**:
1. Install Chrome extension
2. Configure backend URL in settings
3. Start using VibeSurf!

**Result**:
- ✅ Backend runs 24/7 in cloud
- ✅ Extension provides native UI
- ✅ Full browser automation capability
- ✅ No local setup required for users
- ✅ Scalable and maintainable

This is the **correct and intended way** to deploy VibeSurf! 🚀
