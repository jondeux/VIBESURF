# VibeSurf HuggingFace Spaces Deployment

Production-ready Docker containers for deploying VibeSurf on HuggingFace Spaces.

## 🚀 Quick Start

### Choose Your Version

**Two deployment options available:**

1. **[API Version](Dockerfile_API)** - REST API backend for programmatic automation
2. **[UI Version](Dockerfile_UI)** - Full browser interface with VNC (v1.5 - no password!)

Not sure which to choose? See [docs/COMPARISON_GUIDE.md](docs/COMPARISON_GUIDE.md)

---

## 📦 API Version (Recommended for Production)

**Best for**: Automation, backend services, API integration

```bash
# Deploy to HuggingFace Spaces
cp Dockerfile_API Dockerfile
git add Dockerfile
git commit -m "Deploy VibeSurf API"
git push
```

**Documentation**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | [docs/README_HF_SPACES.md](docs/README_HF_SPACES.md)

---

## 🖥️ UI Version (Recommended for Demos)

**Best for**: Interactive use, demos, learning, visual debugging

```bash
# Deploy to HuggingFace Spaces
cp Dockerfile_UI Dockerfile
git add Dockerfile
git commit -m "Deploy VibeSurf UI v1.5"
git push
```

**Features**:
- ✅ Full Chrome browser with VibeSurf extension
- ✅ Web-based VNC interface (noVNC)
- ✅ No password required - just click "Connect"!
- ✅ XFCE desktop environment
- ✅ Auto-start Chrome with extension

**Documentation**: [docs/README_UI_VERSION.md](docs/README_UI_VERSION.md)

---

## ⚙️ Configuration

Both versions require **at least one LLM API key** in HuggingFace Spaces secrets:

```bash
OPENAI_API_KEY=sk-...        # OpenAI models
ANTHROPIC_API_KEY=sk-ant-... # Claude models
GOOGLE_API_KEY=...           # Gemini models
DEEPSEEK_API_KEY=...         # DeepSeek models
# ... or any other supported provider
```

---

## 📚 Complete Documentation

### Getting Started
- **[Overview](docs/README_DOCKERFILES.md)** - Main overview and quick start
- **[Comparison Guide](docs/COMPARISON_GUIDE.md)** - API vs UI decision guide
- **[Documentation Index](docs/INDEX.md)** - Navigate all documentation

### API Version
- **[Deployment Guide](docs/DEPLOYMENT.md)** - Step-by-step API deployment
- **[API Usage Guide](docs/README_HF_SPACES.md)** - Examples and API reference
- **[Technical Details](docs/DOCKER_IMPLEMENTATION_SUMMARY.md)** - Architecture deep dive

### UI Version
- **[UI Deployment Guide](docs/README_UI_VERSION.md)** - Complete UI setup and usage
- **[Build Fixes](docs/DOCKERFILE_UI_FIXES.md)** - Version history and fixes

---

## 🔍 Version Information

### API Version (Dockerfile_API)
- **Status**: ✅ Production Ready
- **Size**: ~500MB
- **Startup**: 30-60 seconds
- **Use**: `curl`, Python, JavaScript
- **Docs**: `/docs` endpoint

### UI Version (Dockerfile_UI)
- **Status**: ✅ Production Ready (v1.5)
- **Version**: 1.5 - No password required!
- **Size**: ~2GB
- **Startup**: 60-90 seconds
- **Use**: Web browser (noVNC)
- **Access**: Just click "Connect"

---

## 📊 Feature Comparison

| Feature | API Version | UI Version |
|---------|-------------|------------|
| **Interface** | REST API | Web VNC Browser |
| **Browser Visible** | No (headless) | Yes (XFCE + Chrome) |
| **Extension UI** | Not accessible | Fully interactive |
| **Use Case** | Automation | Interactive/Demos |
| **RAM Required** | 2-4GB | 4-8GB |
| **Best For** | Production | Development/Testing |

Full comparison: [docs/COMPARISON_GUIDE.md](docs/COMPARISON_GUIDE.md)

---

## 🎯 Quick Deploy Commands

```bash
# For API Version
cp Dockerfile_API Dockerfile && git add Dockerfile && \
git commit -m "Deploy VibeSurf API" && git push

# For UI Version (v1.5 - no password!)
cp Dockerfile_UI Dockerfile && git add Dockerfile && \
git commit -m "Deploy VibeSurf UI v1.5" && git push
```

---

## 🆘 Troubleshooting

### API Version Issues
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) → Troubleshooting section

### UI Version Issues
See [docs/README_UI_VERSION.md](docs/README_UI_VERSION.md) → Troubleshooting section

### Common Problems
- **Build fails**: Check [docs/DOCKERFILE_UI_FIXES.md](docs/DOCKERFILE_UI_FIXES.md)
- **No API key**: Add at least one LLM key in Spaces secrets
- **Out of memory**: Upgrade Space tier

---

## 📖 Additional Resources

- **VibeSurf Repository**: https://github.com/vibesurf-ai/VibeSurf
- **HuggingFace Spaces**: https://huggingface.co/docs/hub/spaces-sdks-docker
- **Discord Community**: https://discord.gg/EZ2YnUXP
- **Issues**: https://github.com/vibesurf-ai/VibeSurf/issues

---

## 📝 License

VibeSurf is licensed under the VibeSurf Open Source License (based on Apache 2.0 with additional conditions). See [LICENSE](https://github.com/vibesurf-ai/VibeSurf/blob/main/LICENSE) for details.

---

<div align="center">

**Two Deployment Options • Full Documentation • Production Ready**

[📖 Full Docs](docs/INDEX.md) • [🆚 Compare Versions](docs/COMPARISON_GUIDE.md) • [🚀 Get Started](docs/README_DOCKERFILES.md)

</div>
