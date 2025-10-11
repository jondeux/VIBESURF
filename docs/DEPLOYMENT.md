# VibeSurf HuggingFace Spaces Deployment Guide

This guide explains how to deploy VibeSurf on HuggingFace Spaces using the production-ready Dockerfile.

## 🎯 Overview

The Dockerfile creates a fully containerized VibeSurf instance with:
- ✅ Python 3.12 runtime environment
- ✅ Chromium browser for automation
- ✅ FastAPI backend on port 7860
- ✅ Headless display (Xvfb) for browser operations
- ✅ Complete dependency management with uv
- ✅ Security compliance (UID 1000, non-root execution)
- ✅ Automatic API key detection and validation
- ✅ Health monitoring and error recovery

## 🚀 Quick Deployment

### Option 1: Deploy to HuggingFace Spaces (Recommended)

1. **Create a new Space on HuggingFace**:
   - Go to https://huggingface.co/new-space
   - Choose "Docker" as the SDK
   - Select appropriate hardware (CPU Basic or better recommended)

2. **Upload the Dockerfile**:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   cd YOUR_SPACE_NAME
   # Copy the Dockerfile to your space repository
   cp /path/to/VibeSurf/Dockerfile .
   git add Dockerfile
   git commit -m "Add VibeSurf Dockerfile"
   git push
   ```

3. **Configure Secrets** (in Space Settings):
   Add at least one LLM API key:
   - `OPENAI_API_KEY` - For OpenAI models
   - `ANTHROPIC_API_KEY` - For Claude models
   - `GOOGLE_API_KEY` - For Gemini models
   - `DEEPSEEK_API_KEY` - For DeepSeek models
   - `MISTRAL_API_KEY` - For Mistral models
   - `DASHSCOPE_API_KEY` - For Alibaba Qwen models
   - `MOONSHOT_API_KEY` - For Moonshot Kimi models

4. **Access Your Space**:
   - Your Space will be available at: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`
   - API documentation: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/docs`

### Option 2: Local Docker Build & Test

```bash
# Build the Docker image locally
docker build -t vibesurf:latest .

# Run locally (for testing)
docker run -p 7860:7860 \
  -e OPENAI_API_KEY=your_key_here \
  vibesurf:latest

# Access at http://localhost:7860
```

## 🔧 Configuration

### Required Environment Variables

At least **ONE** of these API keys must be set:
- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic API key
- `GOOGLE_API_KEY` - Google AI API key
- `DEEPSEEK_API_KEY` - DeepSeek API key
- `MISTRAL_API_KEY` - Mistral AI API key
- `DASHSCOPE_API_KEY` - Alibaba Cloud API key
- `MOONSHOT_API_KEY` - Moonshot AI API key

### Optional Environment Variables

The Dockerfile sets sensible defaults, but you can override:
- `VIBESURF_BACKEND_PORT` - Backend port (default: 7860)
- `BROWSER_USE_LOGGING_LEVEL` - Logging level: result | info | debug (default: info)
- `ANONYMIZED_TELEMETRY` - Enable/disable telemetry (default: false)
- `VIBESURF_DEBUG` - Enable debug mode (default: false)
- `BROWSER_USE_CALCULATE_COST` - Calculate token costs (default: false)

## 📊 Architecture

### Components

1. **Base Image**: Python 3.12-slim
   - Minimal attack surface
   - Optimal for AI applications
   - ~150MB compressed

2. **System Dependencies**:
   - Chromium browser (headless automation)
   - Xvfb (virtual display server)
   - DBus (inter-process communication)
   - Fonts and rendering libraries

3. **Python Dependencies**:
   - FastAPI + uvicorn (web framework)
   - browser-use (browser automation)
   - LangGraph (AI agent orchestration)
   - SQLAlchemy + aiosqlite (database)
   - Multiple LLM integrations

4. **Directory Structure**:
   ```
   /home/user/app/
   ├── data/                    # Persistent data
   │   ├── profiles/           # Browser profiles
   │   ├── workspace/          # Agent workspace
   │   └── database/           # SQLite database
   ├── logs/                    # Application logs
   ├── tmp/                     # Temporary files
   └── vibe_surf/              # Application code
   ```

### Port Configuration

- **Internal**: Application starts on port 7860
- **External**: HuggingFace Spaces exposes port 7860
- **Health Check**: `GET /health` or `GET /`

## 🔍 Dockerfile Features

### Security & Compliance

✅ **Non-root Execution**
- User created with UID 1000
- All files owned by non-root user
- No sudo capabilities

✅ **Minimal Dependencies**
- Only essential packages installed
- Package caches cleaned after installation
- Reduced attack surface

✅ **Secret Management**
- Environment variables for API keys
- No hardcoded credentials
- Dynamic secret detection

### Performance Optimizations

✅ **Layer Caching**
- Dependencies installed before code copy
- Efficient rebuild times
- Minimal layer sizes

✅ **Headless Browser**
- Xvfb for virtual display
- Chromium optimized for Docker
- Proper flags for containerized environment

✅ **Health Monitoring**
- Automatic health checks every 30s
- Container restart on failure
- Startup grace period (60s)

### Advanced Features

✅ **URL Resolution**
- Automatic HF Spaces URL detection
- Dynamic configuration updates
- Proper CORS handling

✅ **Error Recovery**
- Comprehensive startup validation
- Process cleanup and restart
- Detailed error logging

✅ **Multi-LLM Support**
- Automatic API key detection
- Multiple provider support
- Graceful fallback

## 🐛 Troubleshooting

### Build Issues

**Problem**: "Package installation failed"
```bash
# Solution: Check internet connectivity and retry
docker build --no-cache -t vibesurf:latest .
```

**Problem**: "Permission denied"
```bash
# Solution: Ensure proper file permissions
chmod -R 755 /path/to/VibeSurf
```

### Runtime Issues

**Problem**: "No API keys found"
- **Solution**: Add at least one API key in HuggingFace Spaces secrets settings

**Problem**: "Browser automation fails"
- **Solution**: This is expected in some HF Spaces environments. The container includes fallback mechanisms.

**Problem**: "Health check failing"
- **Solution**: Check application logs in Space settings. The startup script provides detailed logging.

### Performance Issues

**Problem**: "Slow startup times"
- **Solution**: This is normal for first startup (30-60s). Subsequent requests are faster.

**Problem**: "Out of memory"
- **Solution**: Upgrade to a higher-tier HuggingFace Space with more RAM.

## 📈 Monitoring

### Health Checks

The Dockerfile includes automatic health monitoring:
- **Interval**: 30 seconds
- **Timeout**: 10 seconds
- **Start Period**: 60 seconds (allows for initialization)
- **Retries**: 3 attempts before marking unhealthy

### Logs

View logs in multiple ways:
1. **HuggingFace Spaces**: Check "Logs" tab in Space settings
2. **Docker**: `docker logs <container_id>`
3. **Inside Container**: `/home/user/app/logs/vibesurf.log`

### Endpoints

Monitor application health:
- `GET /` - API root (returns basic info)
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation
- `GET /openapi.json` - OpenAPI specification

## 🔄 Updates

### Updating VibeSurf

The Dockerfile clones from the official repository. To update:

1. **Rebuild the Docker image**:
   ```bash
   docker build --no-cache -t vibesurf:latest .
   ```

2. **On HuggingFace Spaces**:
   - Trigger a rebuild by pushing any change
   - Or use the "Factory reboot" button in settings

### Version Pinning

To pin a specific version, modify the Dockerfile:
```dockerfile
# Change this line:
RUN git clone https://github.com/vibesurf-ai/VibeSurf.git .

# To this (for a specific version):
RUN git clone --branch v1.0.0 --depth 1 https://github.com/vibesurf-ai/VibeSurf.git .
```

## 🎓 Best Practices

### For Production Deployment

1. **Use Secrets Management**: Never hardcode API keys
2. **Monitor Resource Usage**: Check CPU/RAM metrics regularly
3. **Set Up Alerts**: Configure notifications for downtime
4. **Regular Updates**: Keep dependencies up to date
5. **Backup Data**: Export important data regularly

### For Development

1. **Local Testing**: Always test locally before deploying
2. **Environment Parity**: Match production environment settings
3. **Version Control**: Track all Dockerfile changes
4. **Documentation**: Keep deployment docs updated

## 📞 Support

### Resources

- **VibeSurf GitHub**: https://github.com/vibesurf-ai/VibeSurf
- **HuggingFace Docs**: https://huggingface.co/docs/hub/spaces
- **Docker Documentation**: https://docs.docker.com/

### Common Questions

**Q: Can I use custom LLM endpoints?**
A: Yes! Set the appropriate endpoint environment variables (e.g., `OLLAMA_ENDPOINT` for local Ollama).

**Q: Does this support GPU acceleration?**
A: The current Dockerfile is optimized for CPU. For GPU support, modify the base image to use a CUDA-enabled Python image.

**Q: Can I customize the browser?**
A: Yes! Set `BROWSER_EXECUTION_PATH` and `BROWSER_USER_DATA` environment variables.

**Q: How do I enable debug logging?**
A: Set `BROWSER_USE_LOGGING_LEVEL=debug` in your Space secrets.

## 🔐 Security Notes

### Recommended Security Practices

1. **API Key Rotation**: Regularly rotate your API keys
2. **Access Control**: Use HuggingFace Spaces private mode if needed
3. **Rate Limiting**: Monitor API usage to prevent abuse
4. **Data Privacy**: Be cautious with sensitive data in browser automation

### Known Limitations

- Browser automation in containerized environments has limitations
- Some websites may detect and block automated access
- Resource constraints may affect performance
- Storage is ephemeral unless using HF Spaces persistent storage

## 📝 License

VibeSurf is licensed under the VibeSurf Open Source License (based on Apache 2.0 with additional conditions). See the [LICENSE](LICENSE) file in the VibeSurf repository for details.

## 🙏 Acknowledgments

This Dockerfile follows HuggingFace Spaces best practices and is inspired by production deployments of similar browser automation applications.

Built with:
- [VibeSurf](https://github.com/vibesurf-ai/VibeSurf) - AI-powered browser automation
- [browser-use](https://github.com/browser-use/browser-use) - Browser automation library
- [LangGraph](https://github.com/langchain-ai/langgraph) - AI agent orchestration
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
