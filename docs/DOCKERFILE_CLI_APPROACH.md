# VibeSurf CLI Dockerfile - Using `uv run vibesurf` Entry Point

## 🎯 Overview

This Dockerfile uses VibeSurf's **built-in CLI entry point** (`uv run vibesurf`) instead of directly calling uvicorn. This is a cleaner, more maintainable approach that leverages the package's defined entry point.

## 📊 CLI vs Direct Uvicorn Comparison

| Aspect | CLI Approach (`uv run vibesurf`) | Direct Uvicorn Approach |
|--------|----------------------------------|-------------------------|
| **Command** | `uv run vibesurf` | `uvicorn vibe_surf.backend.main:app` |
| **Simplicity** | ✅ Single command | ❌ Requires module path knowledge |
| **Maintainability** | ✅ Uses package entry point | ❌ Hardcoded module structure |
| **Configuration** | ✅ Built-in defaults | ❌ Manual flag specification |
| **Recommended** | ✅ Yes (docs recommend this) | ⚠️ Works but less elegant |
| **Portability** | ✅ Works across environments | ⚠️ May need adjustments |

## 🔧 Key Differences

### 1. Entry Point

**CLI Approach:**
```bash
uv run vibesurf
```
- Uses entry point defined in `pyproject.toml` or `setup.py`
- Abstracts away internal module structure
- Handles initialization automatically

**Direct Approach:**
```bash
uvicorn vibe_surf.backend.main:app --host 0.0.0.0 --port 9335
```
- Directly calls uvicorn with module path
- Requires knowledge of internal structure
- Manual configuration needed

### 2. Configuration

**CLI Approach:**
```bash
# Configuration via environment variables
export VIBESURF_BACKEND_PORT=7860
export HOST=0.0.0.0
uv run vibesurf  # Reads env vars automatically
```

**Direct Approach:**
```bash
# Configuration via command-line flags
uvicorn vibe_surf.backend.main:app \
    --host 0.0.0.0 \
    --port 7860 \
    --log-level info
```

### 3. Initialization

**CLI Approach:**
- May include additional setup logic
- Proper signal handling
- Built-in error recovery
- Consistent across deployments

**Direct Approach:**
- Minimal initialization
- Basic uvicorn startup
- Manual error handling needed

## 🏗️ Dockerfile Architecture

### Base Configuration

```dockerfile
FROM python:3.12-slim

# Standard HF Spaces environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    VIBESURF_BACKEND_PORT=7860
```

### System Dependencies

Same as API approach:
- Chromium for browser automation
- X11/Xvfb for display
- DBus for IPC
- Font packages for rendering

### Python Environment

```dockerfile
# Clone repository
RUN git clone https://github.com/vvincent1234/VibeSurf.git .

# Create virtual environment with Python 3.12
RUN uv venv --seed --python 3.12 $HOME/.venv

# Install package in editable mode
RUN uv pip install -e .
```

### Startup Command

```dockerfile
CMD ["./start.sh"]

# Inside start.sh:
/usr/local/bin/uv run vibesurf
```

## 🚀 Advantages of CLI Approach

### 1. **Follows Best Practices**
- Uses recommended installation method from docs
- Matches user expectations
- Consistent with local development

### 2. **Future-Proof**
- Package maintainers control entry point
- Internal structure changes won't break deployment
- Automatic updates to initialization logic

### 3. **Cleaner Configuration**
```bash
# CLI approach - simple and clear
export VIBESURF_BACKEND_PORT=7860
uv run vibesurf

# vs Direct approach - more verbose
uvicorn vibe_surf.backend.main:app \
    --host 0.0.0.0 \
    --port 7860 \
    --log-level info \
    --timeout-keep-alive 120 \
    --limit-concurrency 50
```

### 4. **Better Error Messages**
CLI entry point may include:
- Dependency validation
- Configuration checking
- Helpful error messages
- Setup instructions

## 📝 Environment Variables

### Required Variables

```bash
# LLM API Keys (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-...
GOOGLE_API_KEY=...

# Port Configuration (overridden for HF Spaces)
VIBESURF_BACKEND_PORT=7860
HOST=0.0.0.0

# Database Configuration
VIBESURF_DATABASE_URL=sqlite+aiosqlite:///path/to/db
VIBESURF_WORKSPACE=/path/to/workspace

# Browser Configuration
BROWSER_EXECUTION_PATH=/usr/bin/chromium
BROWSER_USER_DATA=/path/to/profiles
DISPLAY=:99
```

### Optional Variables

```bash
# Logging
BROWSER_USE_LOGGING_LEVEL=info
VIBESURF_DEBUG=false

# Features
ANONYMIZED_TELEMETRY=false
BROWSER_USE_CALCULATE_COST=false

# Docker Flag
IN_DOCKER=true
```

## 🔄 Startup Sequence

1. **Environment Setup**
   - Set HF Spaces environment variables
   - Detect API keys
   - Configure URLs

2. **Service Initialization**
   - Clean up stale processes
   - Initialize DBus
   - Start Xvfb display

3. **Browser Verification**
   - Check Chromium installation
   - Verify browser dependencies

4. **Python Validation**
   - Test imports (vibe_surf, fastapi, browser_use)
   - Verify virtual environment

5. **Application Startup**
   - Run `uv run vibesurf`
   - Monitor for errors
   - Log to stdout

## 🐛 Troubleshooting

### Issue: "uv: command not found"

**Cause**: UV not properly installed or not in PATH

**Solution**:
```dockerfile
# Ensure UV is copied and in PATH
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
ENV PATH=/usr/local/bin:$PATH
```

### Issue: "vibesurf: command not found"

**Cause**: Package not installed or entry point not configured

**Solution**:
```bash
# Verify installation
uv pip list | grep vibe-surf

# Reinstall if needed
uv pip install -e .
```

### Issue: Port 7860 not accessible

**Cause**: Application not binding to correct port

**Solution**:
```bash
# Ensure environment variable is set
export VIBESURF_BACKEND_PORT=7860
export HOST=0.0.0.0

# Check if CLI respects these variables
uv run vibesurf
```

### Issue: Browser fails to launch

**Cause**: Missing display or browser dependencies

**Solution**:
```bash
# Check Xvfb is running
ps aux | grep Xvfb

# Verify DISPLAY is set
echo $DISPLAY  # Should show :99

# Check Chromium
/usr/bin/chromium --version
```

## 📦 Build & Deploy

### Local Testing

```bash
# Build the image
docker build -f Dockerfile_CLI -t vibesurf-cli .

# Run locally
docker run -p 7860:7860 \
  -e OPENAI_API_KEY=sk-... \
  vibesurf-cli
```

### HuggingFace Spaces Deployment

1. **Copy to main Dockerfile**:
   ```bash
   cp Dockerfile_CLI Dockerfile
   ```

2. **Set Secrets** in HF Spaces settings:
   - `OPENAI_API_KEY`
   - `ANTHROPIC_API_KEY` (optional)
   - Other API keys as needed

3. **Push to GitHub**:
   ```bash
   git add Dockerfile
   git commit -m "Deploy VibeSurf using CLI entry point"
   git push
   ```

4. **HF Spaces auto-rebuilds** and deploys

## 🎓 When to Use Each Approach

### Use CLI Approach (`uv run vibesurf`) When:
- ✅ Following documentation recommendations
- ✅ Want maximum maintainability
- ✅ Need future-proof deployments
- ✅ Package provides good CLI
- ✅ Want simpler configuration

### Use Direct Uvicorn When:
- ⚠️ Need fine-grained uvicorn control
- ⚠️ Custom server configuration required
- ⚠️ CLI entry point is buggy
- ⚠️ Performance tuning needed
- ⚠️ Multiple workers required

## 🔍 Verification

### Check Application is Running

```bash
# Health check
curl http://localhost:7860/health

# API docs
curl http://localhost:7860/docs

# Root endpoint
curl http://localhost:7860/
```

### Check Logs

```bash
# Inside container
tail -f /home/user/app/logs/vibesurf.log

# Docker logs
docker logs <container_id>
```

### Check Process

```bash
# Inside container
ps aux | grep vibesurf
ps aux | grep uvicorn
```

## 📈 Performance Considerations

### CLI Entry Point
- **Startup Time**: Slightly slower (initializes CLI framework)
- **Memory**: ~Same as direct uvicorn
- **CPU**: ~Same as direct uvicorn
- **Overhead**: Minimal (CLI parsing only)

### Optimization Tips

1. **Use Production WSGI Server** (CLI may use uvicorn internally)
2. **Configure Workers** via environment variables if supported
3. **Enable Caching** for static assets
4. **Monitor Resource Usage** and adjust limits

## 📚 References

- [VibeSurf Installation Docs](https://github.com/vvincent1234/VibeSurf#installation)
- [UV Documentation](https://docs.astral.sh/uv/)
- [HuggingFace Spaces Docs](https://huggingface.co/docs/hub/spaces)

## ✅ Summary

The **CLI approach** (`uv run vibesurf`) is:
- ✅ **Recommended** by VibeSurf docs
- ✅ **Simpler** to configure and maintain
- ✅ **Future-proof** against internal changes
- ✅ **Best practice** for package deployments

This Dockerfile provides a production-ready deployment using VibeSurf's intended entry point, with full HuggingFace Spaces compatibility and comprehensive error handling.
