# VibeSurf UI - Full Browser Interface on HuggingFace Spaces

<div align="center">

![VibeSurf](https://img.shields.io/badge/VibeSurf-Browser%20UI-blue)
![HuggingFace](https://img.shields.io/badge/HuggingFace-Spaces-yellow)
![VNC](https://img.shields.io/badge/noVNC-Web%20Desktop-green)

**Interactive browser-based AI assistant with full Chrome extension UI**

[🚀 Quick Start](#-quick-start) • [📖 Documentation](#-how-it-works) • [🎮 Usage Guide](#-usage-guide)

</div>

---

## 🌟 What is This?

This is the **full UI version** of VibeSurf that runs a complete Chrome browser with the VibeSurf extension in a web-accessible environment. Unlike the API-only version, this gives you:

- 🖥️ **Full Chrome Browser** - Real Chrome running in the cloud
- 🎨 **VibeSurf Extension UI** - Native Chrome extension interface
- 🌐 **Web Access** - Access via any web browser using noVNC
- 🔒 **Password Protected** - Secure VNC connection
- 🚀 **Pre-configured** - Everything set up and ready to use

## 🆚 UI Version vs API Version

| Feature | UI Version (this) | API Version |
|---------|-------------------|-------------|
| **Interface** | Chrome browser with extension | REST API endpoints |
| **Access** | Web-based VNC viewer | HTTP requests only |
| **Use Case** | Interactive browsing | Programmatic automation |
| **Visibility** | See browser in action | Headless operation |
| **Setup** | Click and use | Requires coding |
| **Port** | 7860 (noVNC) | 7860 (API) |
| **Size** | ~2GB | ~500MB |
| **Startup** | 60-90 seconds | 30-60 seconds |

## 🚀 Quick Start

### Deploy to HuggingFace Spaces

1. **Create New Space**:
   - Go to https://huggingface.co/new-space
   - Choose **Docker** SDK
   - Select **CPU Upgrade** (4GB+ RAM recommended)

2. **Upload Dockerfile**:
   ```bash
   git clone https://huggingface.co/spaces/YOUR_USERNAME/YOUR_SPACE_NAME
   cd YOUR_SPACE_NAME
   cp /path/to/Dockerfile_UI ./Dockerfile
   git add Dockerfile
   git commit -m "Add VibeSurf UI"
   git push
   ```

3. **Add API Key** (in Space Settings → Secrets):
   ```
   OPENAI_API_KEY=sk-...
   # Or any other supported LLM provider
   ```

4. **Wait for Build** (~10-15 minutes)

5. **Access Your Space**:
   - Open: `https://YOUR_USERNAME-YOUR_SPACE_NAME.hf.space`
   - You'll see the noVNC interface
   - Default password: `vibesurf`

## 🎮 Usage Guide

### Step 1: Connect to VNC

1. Open your Space URL
2. You'll see the noVNC connection screen
3. Click **"Connect"** button
4. Connection is automatic - **no password required!**
5. Desktop appears immediately

### Step 2: Access Chrome with VibeSurf

Once connected, you'll see an XFCE desktop with:
- Chrome browser automatically starting
- VibeSurf extension pre-loaded
- Extension icon in Chrome toolbar

### Step 3: Use VibeSurf

1. **Click the VibeSurf extension icon** (puzzle piece in toolbar)
2. **Enter your task** in the side panel
3. **Choose settings**:
   - Select LLM model
   - Configure browser options
   - Set automation preferences
4. **Click "Run"** to start the AI agent
5. **Watch the magic** as VibeSurf automates browsing

### Step 4: Monitor Activity

- **Extension Panel**: Shows real-time progress
- **Browser Window**: See actions as they happen
- **Activity Log**: Review completed steps
- **Files Tab**: Download generated files

## 🔧 Configuration

### Environment Variables

Set these in your Space Settings → Repository secrets:

#### Required (at least one)

```bash
# OpenAI
OPENAI_API_KEY=sk-...

# Anthropic Claude  
ANTHROPIC_API_KEY=sk-ant-...

# Google Gemini
GOOGLE_API_KEY=...

# DeepSeek
DEEPSEEK_API_KEY=...

# Other providers supported...
```

#### Optional

```bash
# Logging
BROWSER_USE_LOGGING_LEVEL=info  # debug | info | result

# Features
ANONYMIZED_TELEMETRY=false
VIBESURF_DEBUG=false

# VNC Settings
VNC_RESOLUTION=1920x1080  # Screen resolution
VNC_COL_DEPTH=24         # Color depth
```

### Changing VNC Password

To use a custom password instead of `vibesurf`:

1. Fork this Dockerfile
2. Modify this line:
   ```dockerfile
   RUN echo "vibesurf" | vncpasswd -f > $HOME/.vnc/passwd
   ```
3. Replace `"vibesurf"` with your password
4. Rebuild and deploy

## 🏗️ Architecture

### Components

```
┌─────────────────────────────────────┐
│   Your Web Browser                  │
│   (Firefox, Chrome, Safari, etc.)   │
└─────────────┬───────────────────────┘
              │ HTTPS
              ↓
┌─────────────────────────────────────┐
│   HuggingFace Space (Port 7860)    │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  noVNC Web Interface         │  │
│  │  (WebSocket VNC Client)      │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ↓                       │
│  ┌──────────────────────────────┐  │
│  │  TightVNC Server (Port 5901) │  │
│  │  (X11 Display :1)            │  │
│  └──────────┬───────────────────┘  │
│             │                       │
│             ↓                       │
│  ┌──────────────────────────────┐  │
│  │  XFCE Desktop Environment    │  │
│  │                              │  │
│  │  ┌────────────────────────┐  │  │
│  │  │  Google Chrome         │  │  │
│  │  │  + VibeSurf Extension  │  │  │
│  │  └──────────┬─────────────┘  │  │
│  └─────────────│────────────────┘  │
│                │                    │
│                ↓                    │
│  ┌──────────────────────────────┐  │
│  │  VibeSurf Backend API        │  │
│  │  (uvicorn on port 9335)      │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

### Services Running

1. **TightVNC Server** - VNC server on display :1
2. **noVNC** - WebSocket proxy serving on port 7860
3. **XFCE Desktop** - Lightweight desktop environment
4. **Google Chrome** - Full browser with extension
5. **VibeSurf Backend** - FastAPI server on port 9335

### Port Mapping

- **7860**: noVNC web interface (external)
- **5901**: VNC server (internal only)
- **9335**: VibeSurf API backend (internal only)

## 🔍 Advanced Features

### Desktop Shortcuts

A **VibeSurf** desktop shortcut is automatically created. Double-click to:
- Launch Chrome with extension pre-loaded
- Connect to the backend API
- Open the VibeSurf interface

### Manual Chrome Launch

If Chrome closes, relaunch with:
```bash
google-chrome \
  --load-extension=/home/user/app/vibe_surf/chrome_extension \
  --user-data-dir=/home/user/app/data/profiles/default \
  http://localhost:9335
```

### Terminal Access

The desktop includes **xterm**. Use it to:
- Check logs: `tail -f ~/app/logs/backend.log`
- Restart backend: `pkill uvicorn && ~/app/start_backend.sh`
- Monitor processes: `htop`

### File Management

Download generated files:
1. Open the file manager in XFCE
2. Navigate to `/home/user/app/data/workspace`
3. Right-click files → Copy
4. Paste to local machine (requires additional setup)

*Note: File transfer in noVNC is limited. Consider using the API version for programmatic file access.*

## 🐛 Troubleshooting

### Issue: "Build Failed"

**Symptoms**: HuggingFace Spaces build fails

**Solutions**:
1. **Ensure you're using the latest version** of `Dockerfile_UI`
   - Should include deadsnakes PPA for Python 3.12
   - Should NOT use deprecated `apt-key` command
   - Check `DOCKERFILE_UI_FIXES.md` for version info

2. **Clear build cache**:
   - Go to Space Settings
   - Click "Factory reboot"
   - Push a small change to trigger rebuild

3. **Check specific error**:
   - Look beyond "cache miss" messages
   - Find actual error in build logs
   - Report full error if issue persists

**Note**: If your Dockerfile says "apt-key add", it's an old version. Use the latest `Dockerfile_UI` which installs Chrome via .deb file directly.

### Issue: "Connection Failed"

**Symptoms**: noVNC shows "Failed to connect"

**Solutions**:
1. Wait 90 seconds after Space starts (initial setup)
2. Check Space logs for errors
3. Verify Space hasn't crashed (check status)
4. Try refreshing the page

### Issue: "Password Rejected" or "Authentication Failed"

**Symptoms**: Can't connect to VNC

**Solution**: No password is required in v1.5+. Just click "Connect" and it should work immediately. If you see a password prompt, you may be using an old version - redeploy with the latest Dockerfile_UI.

### Issue: Chrome Not Starting

**Symptoms**: Desktop loads but no Chrome

**Solutions**:
1. Open xterm from Applications menu
2. Run: `/home/user/Desktop/vibesurf.desktop`
3. Check logs: `cat ~/app/logs/backend.log`

### Issue: Extension Not Loading

**Symptoms**: Chrome opens but no VibeSurf extension

**Solutions**:
1. Check Chrome toolbar for extension icon
2. Go to `chrome://extensions` to verify it's loaded
3. Restart Chrome: `pkill chrome && /home/user/Desktop/vibesurf.desktop`

### Issue: Poor Performance

**Symptoms**: Slow, laggy interface

**Solutions**:
1. Upgrade Space to higher tier (more CPU/RAM)
2. Reduce VNC resolution in environment variables
3. Close unused browser tabs
4. Use API version for heavy automation

### Issue: Backend Not Responding

**Symptoms**: Extension can't connect to API

**Solutions**:
1. Open xterm
2. Check backend status: `curl http://localhost:9335/health`
3. View logs: `tail -f ~/app/logs/backend.log`
4. Restart: `pkill uvicorn` (startup script will restart it)

## 📊 Performance Considerations

### Resource Usage

- **CPU**: 2+ cores recommended
- **RAM**: 4GB minimum, 8GB for heavy use
- **Storage**: ~2GB for container + data
- **Network**: 1-2 Mbps for smooth VNC streaming

### Optimization Tips

1. **Lower Resolution**: Set `VNC_RESOLUTION=1280x720` for faster streaming
2. **Compression**: noVNC auto-adjusts based on connection
3. **Fewer Tabs**: Close unused Chrome tabs to save RAM
4. **Disable Effects**: XFCE compositor uses GPU resources

### Startup Time

- **First Boot**: 60-90 seconds
  - VNC server initialization
  - Desktop environment loading
  - Chrome startup with extension
  - Backend API initialization

- **Subsequent Access**: Instant (if container didn't restart)

## 🔒 Security

### Built-in Security

✅ **VNC Password**: Prevents unauthorized access
✅ **Non-root User**: All services run as UID 1000
✅ **Localhost Binding**: Backend API not exposed externally
✅ **No Hardcoded Secrets**: Uses HF Spaces secrets management

### Additional Security

For production use:
1. **Change VNC password** from default
2. **Use strong API keys** and rotate regularly
3. **Enable HF Spaces auth** if available
4. **Monitor activity logs** for unusual behavior
5. **Don't store sensitive data** in browser profiles

### Privacy Notes

- Browser profiles persist in `/home/user/app/data/profiles`
- Browsing history stored locally in container
- Data resets on container restart (unless using persistent storage)
- VNC traffic is encrypted via HTTPS (HF Spaces handles SSL)

## 💡 Tips & Tricks

### Keyboard Shortcuts

noVNC provides these shortcuts:
- **Ctrl+Alt+Shift**: Open noVNC control panel
- **Full Screen**: Click fullscreen icon in noVNC toolbar
- **Clipboard**: Use noVNC clipboard sync (left sidebar)

### Chrome Tips

- **Extension Shortcuts**: Configure in `chrome://extensions/shortcuts`
- **Bookmarks**: Save frequently used URLs
- **Profiles**: Use Chrome profiles for different tasks
- **Extensions**: Add other extensions if needed

### Workflow Optimization

1. **Prepare Tasks**: Have clear objectives before starting
2. **Monitor Progress**: Keep extension panel visible
3. **Save Results**: Export files before closing
4. **Document Settings**: Note successful configurations

## 🆘 Support

### Resources

- **VibeSurf GitHub**: https://github.com/vibesurf-ai/VibeSurf
- **Issues**: https://github.com/vibesurf-ai/VibeSurf/issues
- **Discord**: https://discord.gg/EZ2YnUXP
- **HF Spaces Docs**: https://huggingface.co/docs/hub/spaces-sdks-docker

### Common Questions

**Q: Can I install other Chrome extensions?**  
A: Yes! Use Chrome's extension manager as normal.

**Q: Can I change the desktop environment?**  
A: Yes, modify Dockerfile to use different DE (LXDE, KDE, etc.)

**Q: Can I access files generated by VibeSurf?**  
A: Limited in browser. For file access, use API version or set up file sharing.

**Q: Can multiple users connect?**  
A: No, VNC supports one connection at a time. For multi-user, deploy multiple Spaces.

**Q: Can I use this with local Ollama?**  
A: Not directly from HF Spaces. Ollama needs to be accessible via public URL.

**Q: Is clipboard sync available?**  
A: Yes! Use the clipboard icon in noVNC's left sidebar.

## 📝 Comparison with API Version

### When to Use UI Version

✅ You want to see browser automation in action  
✅ You prefer visual interface over coding  
✅ You're testing/debugging agent behavior  
✅ You need interactive browsing control  
✅ You're demonstrating to non-technical users

### When to Use API Version

✅ You need programmatic access  
✅ You're integrating with other systems  
✅ You want faster, headless automation  
✅ You need to process many requests  
✅ You want lower resource usage

### Switching Between Versions

Both use the same backend and extension code:
- UI Version: Interactive visual interface
- API Version: Headless REST API

You can deploy both and use whichever fits your workflow!

## 🎓 Next Steps

### Getting Started

1. ✅ Deploy the Space
2. ✅ Connect via noVNC
3. ✅ Run your first task
4. ✅ Explore the extension features

### Learning More

- Read the [VibeSurf Documentation](https://github.com/vibesurf-ai/VibeSurf)
- Watch demo videos in the repository
- Join the Discord community
- Try different LLM models

### Advanced Usage

- Create custom automation workflows
- Use multiple browser tabs for parallel tasks
- Integrate with external APIs
- Build complex multi-step agents

## 📄 License

VibeSurf is licensed under the VibeSurf Open Source License (based on Apache 2.0 with additional conditions). See the [LICENSE](https://github.com/vibesurf-ai/VibeSurf/blob/main/LICENSE) file for details.

---

<div align="center">

**Enjoy Your Full-Featured VibeSurf Browser! 🎉**

[⭐ Star on GitHub](https://github.com/vibesurf-ai/VibeSurf) • [💬 Join Discord](https://discord.gg/EZ2YnUXP) • [🐦 Follow on Twitter](https://x.com/warmshao)

</div>
