# VibeSurf HuggingFace Spaces Dockerfiles

## 📦 Available Dockerfiles

This repository contains **two production-ready Dockerfiles** for deploying VibeSurf on HuggingFace Spaces, each optimized for different use cases:

### 1. Dockerfile_API - REST API Backend
**File**: `Dockerfile_API`  
**Size**: ~500MB compressed  
**Interface**: REST API endpoints  
**Use Case**: Programmatic automation, backend services

### 2. Dockerfile_UI - Full Browser Interface
**File**: `Dockerfile_UI`  
**Size**: ~2GB compressed  
**Interface**: Web-based VNC with Chrome UI  
**Use Case**: Interactive browsing, demos, testing

## 🚀 Quick Start

### Option 1: API Version (Recommended for Production)

```bash
# Copy API Dockerfile
cp Dockerfile_API Dockerfile

# Deploy to HuggingFace Spaces
git add Dockerfile
git commit -m "Deploy VibeSurf API"
git push
```

**Access**: `https://your-space.hf.space/docs`

### Option 2: UI Version (Recommended for Learning)

```bash
# Copy UI Dockerfile
cp Dockerfile_UI Dockerfile

# Deploy to HuggingFace Spaces
git add Dockerfile
git commit -m "Deploy VibeSurf UI"
git push
```

**Access**: `https://your-space.hf.space/` (noVNC interface)  
**Password**: `vibesurf`

## 📖 Documentation

Each version has comprehensive documentation:

### API Version Documentation
- **DEPLOYMENT.md** - Complete deployment guide
- **README_HF_SPACES.md** - User guide and API examples
- **DOCKER_IMPLEMENTATION_SUMMARY.md** - Technical details

### UI Version Documentation
- **README_UI_VERSION.md** - UI version guide and usage

### Comparison
- **COMPARISON_GUIDE.md** - Detailed comparison and decision guide

## 🎯 Which One Should I Use?

### Use API Version If:
- ✅ Building automation pipelines
- ✅ Need REST API integration
- ✅ Want headless browser automation
- ✅ Prefer programmatic control
- ✅ Running on free tier HF Spaces

### Use UI Version If:
- ✅ Want visual interface
- ✅ Need to see browser in action
- ✅ Testing or debugging
- ✅ Demonstrating to others
- ✅ Learning how VibeSurf works

**See [COMPARISON_GUIDE.md](COMPARISON_GUIDE.md) for detailed comparison.**

## 📊 Feature Comparison

| Feature | API Version | UI Version |
|---------|-------------|------------|
| **Interface** | REST API | Web VNC Browser |
| **Browser** | Headless Chromium | Full Chrome + Extension |
| **Port** | 7860 | 7860 (noVNC) |
| **Startup** | 30-60s | 60-90s |
| **Size** | 500MB | 2GB |
| **RAM** | 2-4GB | 4-8GB |
| **Best For** | Automation | Interactive Use |

## 🔧 Configuration

Both versions require **at least one LLM API key** in HuggingFace Spaces secrets:

```bash
# Required (choose at least one)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_API_KEY=...
DEEPSEEK_API_KEY=...
MISTRAL_API_KEY=...

# Optional
BROWSER_USE_LOGGING_LEVEL=info
ANONYMIZED_TELEMETRY=false
```

## 🏗️ Technical Architecture

### API Version Architecture
```
HTTP Request → FastAPI (port 7860)
                  ↓
            Browser-Use Agent
                  ↓
            Chromium (headless)
                  ↓
              Response
```

### UI Version Architecture
```
Web Browser → noVNC (port 7860)
                 ↓
            VNC Server (port 5901)
                 ↓
            XFCE Desktop
                 ↓
         Chrome + Extension
                 ↓
         FastAPI Backend (port 9335)
```

## 📝 File Structure

```
VIBESURF-1/
├── Dockerfile_API                      ← REST API version
├── Dockerfile_UI                       ← Browser UI version
│
├── DEPLOYMENT.md                       ← API deployment guide
├── README_HF_SPACES.md                 ← API user guide
├── DOCKER_IMPLEMENTATION_SUMMARY.md    ← Technical implementation
├── README_UI_VERSION.md                ← UI version guide
├── COMPARISON_GUIDE.md                 ← Version comparison
└── README_DOCKERFILES.md               ← This file
```

## 🎓 Getting Started Guide

### Step 1: Choose Your Version

Read [COMPARISON_GUIDE.md](COMPARISON_GUIDE.md) to understand the differences.

**Quick Decision**:
- Need API? → Use `Dockerfile_API`
- Need UI? → Use `Dockerfile_UI`
- Not sure? → Start with `Dockerfile_UI` (easier to learn)

### Step 2: Create HuggingFace Space

1. Go to https://huggingface.co/new-space
2. Name your Space (e.g., `vibesurf-demo`)
3. Choose **Docker** as SDK
4. Select hardware tier:
   - API Version: CPU Basic (free) or CPU Upgrade
   - UI Version: CPU Upgrade (paid) recommended

### Step 3: Deploy Dockerfile

```bash
# Clone your Space repository
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE

cd YOUR_SPACE

# Copy your chosen Dockerfile
cp /path/to/Dockerfile_API ./Dockerfile
# OR
cp /path/to/Dockerfile_UI ./Dockerfile

# Commit and push
git add Dockerfile
git commit -m "Add VibeSurf"
git push
```

### Step 4: Configure Secrets

In your Space Settings → Repository secrets:

1. Add at least **one LLM API key**:
   - `OPENAI_API_KEY` (for OpenAI models)
   - `ANTHROPIC_API_KEY` (for Claude)
   - `GOOGLE_API_KEY` (for Gemini)
   - Or any other supported provider

2. Optionally configure:
   - `BROWSER_USE_LOGGING_LEVEL=debug` (for verbose logs)
   - Other environment variables as needed

### Step 5: Wait and Access

**Build Time**:
- API Version: 5-10 minutes
- UI Version: 10-15 minutes

**Access Your Space**:
- API Version: Opens to API documentation at `/docs`
- UI Version: Opens to noVNC login screen

## 🔍 Verification

### Verify API Version Deployment

```bash
# Check health
curl https://your-space.hf.space/health

# Expected: {"status": "healthy", ...}

# Check API docs
curl https://your-space.hf.space/docs

# Expected: HTML page with API documentation
```

### Verify UI Version Deployment

1. Open `https://your-space.hf.space/`
2. Should see noVNC connection screen
3. Click "Connect"
4. Enter password: `vibesurf`
5. Should see XFCE desktop with Chrome

## 🐛 Troubleshooting

### Common Issues

**Issue**: Build fails  
**Solution**: Check Space logs for specific error, verify Dockerfile syntax

**Issue**: No API keys found  
**Solution**: Add at least one LLM API key in Space secrets

**Issue**: Out of memory  
**Solution**: Upgrade to higher tier Space (especially for UI version)

**Issue**: Health check fails  
**Solution**: Wait full startup period (60-90s), check logs

### Getting Help

- **API Version**: See [DEPLOYMENT.md](DEPLOYMENT.md) troubleshooting section
- **UI Version**: See [README_UI_VERSION.md](README_UI_VERSION.md) troubleshooting section
- **General**: Check [VibeSurf GitHub Issues](https://github.com/vibesurf-ai/VibeSurf/issues)
- **Community**: Join [Discord](https://discord.gg/EZ2YnUXP)

## 📊 Performance Tips

### API Version Optimization

1. **Use CPU Upgrade tier** for better concurrency
2. **Enable caching** for repeated requests
3. **Monitor token usage** to control costs
4. **Implement rate limiting** for production

### UI Version Optimization

1. **Lower VNC resolution** if laggy (set `VNC_RESOLUTION=1280x720`)
2. **Close unused Chrome tabs** to save memory
3. **Use higher tier** if performance issues
4. **Disable desktop effects** in XFCE settings

## 🔄 Updates and Maintenance

### Updating VibeSurf

Both Dockerfiles clone the latest VibeSurf code during build.

**To update**:
```bash
# Trigger rebuild in HuggingFace Spaces
# Option 1: Use "Factory reboot" button in Space settings
# Option 2: Push any change to trigger rebuild
git commit --allow-empty -m "Trigger rebuild"
git push
```

### Version Pinning

To pin a specific VibeSurf version, modify the Dockerfile:

```dockerfile
# Change this line:
RUN git clone https://github.com/vibesurf-ai/VibeSurf.git .

# To this (example for version 1.0.0):
RUN git clone --branch v1.0.0 --depth 1 https://github.com/vibesurf-ai/VibeSurf.git .
```

## 💡 Tips

### For Developers

1. **Start with API version** for programmatic control
2. **Use UI version** for debugging complex issues
3. **Deploy both** if you need both interfaces
4. **Read API docs** at `/docs` endpoint
5. **Monitor logs** in Space settings

### For Non-Developers

1. **Start with UI version** for easier learning
2. **Use desktop shortcuts** in XFCE for quick access
3. **Save your work** before closing browser
4. **Try different models** to find what works best
5. **Join Discord** to learn from others

## 🎯 Production Checklist

Before going to production:

- [ ] Choose appropriate Dockerfile for use case
- [ ] Set up all required API keys
- [ ] Test thoroughly in staging
- [ ] Configure appropriate hardware tier
- [ ] Set up monitoring and alerts
- [ ] Document your configuration
- [ ] Plan for updates and maintenance
- [ ] Consider backup strategy
- [ ] Review security settings
- [ ] Test error handling

## 📞 Support

### Resources

- **VibeSurf Repository**: https://github.com/vibesurf-ai/VibeSurf
- **HuggingFace Spaces**: https://huggingface.co/docs/hub/spaces
- **Discord Community**: https://discord.gg/EZ2YnUXP
- **Issue Tracker**: https://github.com/vibesurf-ai/VibeSurf/issues

### Documentation

- API Version: [DEPLOYMENT.md](DEPLOYMENT.md) + [README_HF_SPACES.md](README_HF_SPACES.md)
- UI Version: [README_UI_VERSION.md](README_UI_VERSION.md)
- Comparison: [COMPARISON_GUIDE.md](COMPARISON_GUIDE.md)
- Technical: [DOCKER_IMPLEMENTATION_SUMMARY.md](DOCKER_IMPLEMENTATION_SUMMARY.md)

## 📄 License

VibeSurf is licensed under the VibeSurf Open Source License (based on Apache 2.0). See [LICENSE](https://github.com/vibesurf-ai/VibeSurf/blob/main/LICENSE) for details.

Both Dockerfiles are provided as part of the VibeSurf project and follow the same license terms.

---

<div align="center">

**Two Deployment Options, One Powerful AI Browser**

Choose the version that fits your needs and start automating!

[⭐ Star on GitHub](https://github.com/vibesurf-ai/VibeSurf) • [📖 Read Docs](COMPARISON_GUIDE.md) • [💬 Get Help](https://discord.gg/EZ2YnUXP)

</div>
