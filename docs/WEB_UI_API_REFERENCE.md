# VibeSurf Web UI - API Reference

## 📋 API Endpoints Used by Web UI

This document lists all the API endpoints that the web UI (`Dockerfile_WEB`) uses to communicate with the VibeSurf backend.

## ✅ Core Endpoints

### Health Check
```
GET /health
```
**Purpose**: Check if backend is running  
**Response**: `200 OK` with health status

### Session Management
```
GET /generate-session-id
```
**Purpose**: Generate unique session ID for tracking tasks  
**Response**: `{ "session_id": "uuid" }`

## 🎯 Task Management

### Submit Task
```
POST /api/tasks/submit
```
**Body (multipart/form-data)**:
- `task` (string, required): Task description
- `session_id` (string, required): Session ID from `/generate-session-id`
- `upload_files` (file[], optional): Files to upload with task

**Response**:
```json
{
  "task_id": "uuid",
  "session_id": "uuid",
  "status": "pending"
}
```

### Pause Task
```
POST /api/tasks/pause
```
**Body (JSON)**:
```json
{
  "session_id": "uuid"
}
```

### Resume Task
```
POST /api/tasks/resume
```
**Body (JSON)**:
```json
{
  "session_id": "uuid"
}
```

### Stop Task
```
POST /api/tasks/stop
```
**Body (JSON)**:
```json
{
  "session_id": "uuid"
}
```

## 📊 Activity Monitoring

### Get Latest Activity
```
GET /api/activity/sessions/{session_id}/latest_activity
```
**Purpose**: Poll for real-time task updates  
**Used by**: Activity polling (every 2 seconds)

**Response**:
```json
[
  {
    "agent_name": "string",
    "action": "string",
    "result": "string",
    "timestamp": "iso8601"
  }
]
```

### Get All Activity
```
GET /api/activity/sessions/{session_id}/activity
```
**Purpose**: Get complete activity history for session

## 🔧 Common Errors & Solutions

### 404 Not Found
**Cause**: Wrong endpoint path (e.g., `/api/task/submit` instead of `/api/tasks/submit`)  
**Fix**: Use plural `/api/tasks/*` endpoints

### 422 Unprocessable Entity
**Cause**: Missing required fields or wrong data format  
**Fix**: Check request body matches expected format

### 500 Internal Server Error
**Cause**: Backend error (missing API keys, browser issues, etc.)  
**Fix**: Check backend logs in HuggingFace Spaces

## 📝 Implementation Example

### JavaScript Fetch Example

```javascript
// Submit a task
const formData = new FormData();
formData.append('task', 'Search for latest AI news');
formData.append('session_id', currentSessionId);
formData.append('upload_files', fileObject); // optional

const response = await fetch('/api/tasks/submit', {
    method: 'POST',
    body: formData
});

const data = await response.json();
console.log('Task ID:', data.task_id);
```

```javascript
// Pause a task
const response = await fetch('/api/tasks/pause', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: currentSessionId })
});
```

```javascript
// Poll for activity
setInterval(async () => {
    const response = await fetch(`/api/activity/sessions/${sessionId}/latest_activity`);
    const activities = await response.json();
    updateUI(activities);
}, 2000); // Poll every 2 seconds
```

## 🌐 Full API Documentation

For complete API documentation with all endpoints (not just those used by web UI), visit:

```
https://your-space.hf.space/docs
```

This opens the interactive Swagger UI where you can:
- See all available endpoints
- View request/response schemas
- Test API calls directly
- Download OpenAPI spec

## 🔍 Backend Router Structure

VibeSurf's API is organized by routers:

```python
# main.py
app.include_router(tasks_router, prefix="/api/tasks")
app.include_router(files_router, prefix="/api/files")
app.include_router(activity_router, prefix="/api/activity")
app.include_router(config_router, prefix="/api/config")
app.include_router(browser_router, prefix="/api/browser")
app.include_router(voices_router, prefix="/api/voices")
app.include_router(agent_router, prefix="/api/agent")
```

**Important**: Note the plural `/tasks`, not singular `/task`!

## 🐛 Debugging Tips

### Check Network Requests

1. Open browser DevTools (F12)
2. Go to Network tab
3. Submit a task
4. Look for failed requests (red status)
5. Click request to see details

### Common Issues

**Problem**: "Not Found" errors  
**Solution**: Verify endpoint paths match backend router structure

**Problem**: CORS errors  
**Solution**: VibeSurf backend handles CORS, but check if you're making cross-origin requests

**Problem**: Timeout errors  
**Solution**: Tasks may take time; increase timeout or implement better progress UI

**Problem**: "Unauthorized" errors  
**Solution**: VibeSurf doesn't require auth by default, but check if you've modified backend

## 📈 Performance Considerations

### Polling Interval

```javascript
// Current: Poll every 2 seconds
setInterval(pollActivity, 2000);

// For production, consider:
// - Exponential backoff when no activity
// - WebSocket for real-time updates
// - Pause polling when user is idle
```

### File Upload

```javascript
// For large files, consider:
// - Chunked uploads
// - Progress indicators
// - Upload validation before submitting
```

## 🔐 Security Notes

### API Keys

- API keys (OpenAI, etc.) are configured in HuggingFace Spaces **secrets**
- Never sent to frontend
- Only backend uses them

### Session IDs

- Generated by backend
- Stored in client `localStorage`
- Used to track task execution
- **Not** for authentication (VibeSurf doesn't have user auth by default)

### File Uploads

- Handled by FastAPI multipart parsing
- Stored temporarily in backend
- Cleaned up after task completion

## ✅ Testing Checklist

Before deploying web UI changes:

- [ ] Test task submission with text only
- [ ] Test task submission with files
- [ ] Test pause/resume/stop controls
- [ ] Verify activity polling works
- [ ] Check error handling (wrong endpoints, missing fields)
- [ ] Test on mobile (responsive design)
- [ ] Verify API docs still accessible at `/docs`
- [ ] Check backend logs for errors

## 🔄 Version History

### v1.0 (Initial)
- Basic task submission
- Activity polling
- Control buttons

### v1.1 (Endpoint Fix)
- Fixed `/api/task/*` → `/api/tasks/*` (plural)
- Proper error messages
- Better logging

## 📚 Related Documentation

- [Dockerfile_WEB_ARCHITECTURE.md](./DOCKERFILE_WEB_ARCHITECTURE.md) - Complete architecture
- [DOCKERFILE_COMPARISON.md](../DOCKERFILE_COMPARISON.md) - Compare deployment options
- [HUGGINGFACE_DEPLOYMENT.md](./HUGGINGFACE_DEPLOYMENT.md) - Deployment guide

## 💡 Tips

1. **Always check `/docs`** first when adding new features
2. **Use browser DevTools Network tab** for debugging API calls
3. **Backend logs** in HuggingFace Spaces show detailed errors
4. **Test locally** before deploying to production
5. **Keep this doc updated** when API changes

---

**Last Updated**: 2025-10-11  
**Web UI Version**: 1.1  
**VibeSurf Backend**: Compatible with latest version
