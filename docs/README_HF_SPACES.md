# VibeSurf on HuggingFace Spaces

<div align="center">

![VibeSurf](https://img.shields.io/badge/VibeSurf-AI%20Browser-blue)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-yellow)
![Docker](https://img.shields.io/badge/Docker-Production%20Ready-success)
![Python](https://img.shields.io/badge/Python-3.12-blue)

**An AI-powered browser automation assistant running on HuggingFace Spaces**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](DEPLOYMENT.md) • [🐛 Issues](https://github.com/vibesurf-ai/VibeSurf/issues)

</div>

---

## 🌟 What is VibeSurf?

VibeSurf is an open-source AI agentic browser that revolutionizes browser automation and research. This Space provides a fully containerized instance ready for production use.

### ✨ Key Features

- 🧠 **Advanced AI Automation**: Deep research, intelligent crawling, and content summarization
- 🚀 **Multi-Agent Processing**: Run multiple AI agents simultaneously
- 🥷 **Stealth-First Architecture**: Chrome DevTools Protocol for superior stealth
- 🔒 **Privacy-First**: Support for local LLMs and custom APIs
- 🎨 **RESTful API**: Easy integration with any application

## 🚀 Quick Start

### Using This Space

1. **Access the API**:
   - API Root: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/`
   - Interactive Docs: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/docs`
   - Health Check: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space/health`

2. **Configure Your LLM** (in Space Settings → Repository secrets):
   Add at least ONE of these:
   ```
   OPENAI_API_KEY=sk-...
   ANTHROPIC_API_KEY=sk-ant-...
   GOOGLE_API_KEY=...
   DEEPSEEK_API_KEY=...
   ```

3. **Start Using**:
   ```bash
   # Example: Create a browser automation task
   curl -X POST "https://YOUR_SPACE_URL/api/task" \
     -H "Content-Type: application/json" \
     -d '{"task": "Search Google for AI agents and summarize results"}'
   ```

### Deploying Your Own Instance

<details>
<summary>Click to expand deployment instructions</summary>

#### Step 1: Create New Space

1. Go to https://huggingface.co/new-space
2. Choose **Docker** as the SDK
3. Select hardware tier (CPU Basic recommended minimum)

#### Step 2: Add Dockerfile

```bash
# Clone your new space
git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
cd YOUR_SPACE_NAME

# Download the Dockerfile
wget https://raw.githubusercontent.com/vibesurf-ai/VibeSurf/main/Dockerfile

# Or if you have the file locally
cp /path/to/Dockerfile .

# Commit and push
git add Dockerfile
git commit -m "Add VibeSurf Dockerfile"
git push
```

#### Step 3: Configure Secrets

In your Space Settings → Repository secrets, add:

**Required** (at least one):
- `OPENAI_API_KEY` - OpenAI models (GPT-4, GPT-3.5, etc.)
- `ANTHROPIC_API_KEY` - Anthropic Claude models
- `GOOGLE_API_KEY` - Google Gemini models
- `DEEPSEEK_API_KEY` - DeepSeek models
- `MISTRAL_API_KEY` - Mistral AI models

**Optional**:
- `DASHSCOPE_API_KEY` - Alibaba Qwen models
- `MOONSHOT_API_KEY` - Moonshot Kimi models
- `AZURE_OPENAI_ENDPOINT` - Azure OpenAI endpoint
- `AZURE_OPENAI_API_KEY` - Azure OpenAI key
- `OLLAMA_ENDPOINT` - Local Ollama endpoint

#### Step 4: Wait for Build

Your Space will automatically build and deploy. This takes 5-10 minutes on first build.

#### Step 5: Access Your Space

- Your Space URL: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`
- API Documentation: Add `/docs` to your URL
- Health Check: Add `/health` to your URL

</details>

## 📚 API Documentation

### Available Endpoints

Once deployed, visit `/docs` for interactive API documentation. Key endpoints include:

#### Core Endpoints

- `GET /` - API information and status
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation
- `GET /openapi.json` - OpenAPI specification

#### Agent Endpoints

- `POST /api/agent/run` - Run a browser automation task
- `GET /api/agent/status/{task_id}` - Check task status
- `POST /api/agent/stop/{task_id}` - Stop a running task

#### Browser Endpoints

- `GET /api/browser/sessions` - List active browser sessions
- `POST /api/browser/session/new` - Create new browser session
- `DELETE /api/browser/session/{session_id}` - Close browser session

### Example Usage

<details>
<summary>Python Example</summary>

```python
import requests

# Your Space URL
BASE_URL = "https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space"

# Create a browser automation task
response = requests.post(
    f"{BASE_URL}/api/agent/run",
    json={
        "task": "Search Google for 'AI agents' and extract the top 5 results",
        "model": "gpt-4",  # or your preferred model
    }
)

task_id = response.json()["task_id"]
print(f"Task created: {task_id}")

# Check task status
status = requests.get(f"{BASE_URL}/api/agent/status/{task_id}")
print(status.json())
```

</details>

<details>
<summary>JavaScript Example</summary>

```javascript
const BASE_URL = 'https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space';

// Create a browser automation task
async function runTask() {
  const response = await fetch(`${BASE_URL}/api/agent/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      task: 'Search Google for AI agents and summarize',
      model: 'gpt-4'
    })
  });
  
  const data = await response.json();
  console.log('Task ID:', data.task_id);
  
  // Check status
  const status = await fetch(`${BASE_URL}/api/agent/status/${data.task_id}`);
  console.log('Status:', await status.json());
}

runTask();
```

</details>

<details>
<summary>cURL Example</summary>

```bash
# Create a task
curl -X POST "https://YOUR_SPACE_URL/api/agent/run" \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Search for AI browser automation tools and compare them",
    "model": "gpt-4"
  }'

# Check health
curl "https://YOUR_SPACE_URL/health"

# Get API documentation (returns HTML)
curl "https://YOUR_SPACE_URL/docs"
```

</details>

## ⚙️ Configuration

### Environment Variables

Configure your Space by setting these environment variables in Settings → Repository secrets:

#### LLM Configuration (Required - at least one)

```bash
# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_ENDPOINT=https://api.openai.com/v1  # Optional, defaults to OpenAI

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_ENDPOINT=https://api.anthropic.com  # Optional

# Google Gemini
GOOGLE_API_KEY=...

# DeepSeek
DEEPSEEK_API_KEY=...
DEEPSEEK_ENDPOINT=https://api.deepseek.com  # Optional

# Other providers...
```

#### Application Configuration (Optional)

```bash
# Logging
BROWSER_USE_LOGGING_LEVEL=info  # Options: result | info | debug

# Features
ANONYMIZED_TELEMETRY=false
BROWSER_USE_CALCULATE_COST=false
VIBESURF_DEBUG=false

# Docker optimization
IN_DOCKER=true  # Automatically set
```

## 🏗️ Architecture

This Space uses a production-ready Docker container with:

- **Base**: Python 3.12-slim (optimized for AI applications)
- **Browser**: Chromium with headless display (Xvfb)
- **Server**: FastAPI + uvicorn
- **Automation**: browser-use + Chrome DevTools Protocol
- **AI**: LangGraph for agent orchestration
- **Database**: SQLite (aiosqlite)
- **Security**: Non-root user (UID 1000), minimal dependencies

### Resource Usage

- **CPU**: 1-2 cores recommended (browser automation can be CPU-intensive)
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: ~2GB for container, additional for data
- **Startup**: 30-60 seconds (first boot)

## 🔧 Customization

### Using Custom Models

Set the appropriate endpoint environment variables:

```bash
# Example: Local Ollama
OLLAMA_ENDPOINT=http://your-ollama-server:11434

# Example: Azure OpenAI
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=...
AZURE_OPENAI_API_VERSION=2025-01-01-preview
```

### Advanced Configuration

For advanced customization, fork the repository and modify:
- `Dockerfile` - Change base image, dependencies, or configuration
- `start.sh` - Modify startup behavior (embedded in Dockerfile)
- Environment variables - Override any default settings

## 📊 Monitoring

### Health Checks

The container includes automatic health monitoring:
- Endpoint: `GET /health` or `GET /`
- Interval: Every 30 seconds
- Timeout: 10 seconds
- Retries: 3 before marking unhealthy

### Logs

View logs in your Space:
1. Go to your Space page
2. Click "Logs" tab
3. View real-time application logs

Or check via Docker:
```bash
docker logs <container_id>
```

## 🐛 Troubleshooting

### Common Issues

**Problem**: "Application not starting"
- Check that at least one API key is configured
- View logs for detailed error messages
- Verify Space has sufficient resources

**Problem**: "Browser automation fails"
- This can occur in restricted environments
- Check if the website blocks automation
- Try with a different target website

**Problem**: "Slow response times"
- Browser automation is resource-intensive
- Consider upgrading to a higher-tier Space
- Reduce concurrent tasks

### Getting Help

1. Check the [Deployment Guide](DEPLOYMENT.md) for detailed troubleshooting
2. Review logs in your Space settings
3. Open an issue on [GitHub](https://github.com/vibesurf-ai/VibeSurf/issues)
4. Join the [Discord community](https://discord.gg/EZ2YnUXP)

## 📖 Additional Resources

- **Full Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **VibeSurf GitHub**: https://github.com/vibesurf-ai/VibeSurf
- **HuggingFace Docs**: https://huggingface.co/docs/hub/spaces-sdks-docker
- **Browser-Use**: https://github.com/browser-use/browser-use

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the VibeSurf repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

VibeSurf is licensed under the VibeSurf Open Source License (based on Apache 2.0 with additional conditions).

Key points:
- ✅ Free for personal and commercial use
- ✅ Can be used as a backend service
- ❌ Cannot operate as multi-tenant SaaS without explicit authorization
- ❌ Cannot remove LOGO/copyright from frontend components

See [LICENSE](https://github.com/vibesurf-ai/VibeSurf/blob/main/LICENSE) for full details.

## 🌟 Show Your Support

If you find VibeSurf useful:
- ⭐ Star the [GitHub repository](https://github.com/vibesurf-ai/VibeSurf)
- 🐦 Follow [@warmshao](https://x.com/warmshao) on Twitter
- 💬 Join the [Discord community](https://discord.gg/EZ2YnUXP)
- 📢 Share with others who might benefit

## 🔗 Links

- **VibeSurf Homepage**: https://github.com/vibesurf-ai/VibeSurf
- **Documentation**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: https://github.com/vibesurf-ai/VibeSurf/issues
- **Discord**: https://discord.gg/EZ2YnUXP
- **Twitter**: https://x.com/warmshao

---

<div align="center">

**Built with ❤️ by the VibeSurf Team**

</div>
