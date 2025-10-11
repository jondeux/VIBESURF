# VibeSurf Enhanced Web UI

This directory contains the enhanced web UI with all 6 requested features:

1. ✅ **File Upload** - Working file upload with backend integration
2. ✅ **Task History** - View previous tasks from session
3. ✅ **Detailed Status** - Better progress indicators with detailed status
4. ✅ **LLM Profile Selector** - Choose which LLM to use
5. ✅ **Browser Tab Viewer** - Show active browser tabs
6. ✅ **Settings Panel** - Configure environment variables

## Features

### Enhanced Task Management
- LLM profile selection dropdown
- Agent mode selector (thinking/no-thinking/flash)
- File upload with progress indication
- Real-time detailed status with progress bars
- Pause/Resume/Stop controls

### History & Activity
- View all past tasks
- Filter by session
- Task details and results
- Clear history option

### Browser Control
- View all open tabs
- See active tab
- Tab information display

### Settings & Configuration
- Manage LLM profiles (create, update, delete)
- View/edit environment variables
- Voice profile management
- Provider and model selection

## File Structure

```
web_ui_enhanced/
├── index.html          # Enhanced HTML with tabs and modals
├── style.css           # Complete styling with responsive design
├── app.js              # Full JavaScript with all API integrations
└── README.md           # This file
```

## API Endpoints Used

### Tasks
- POST /api/tasks/submit
- POST /api/tasks/pause
- POST /api/tasks/resume
- POST /api/tasks/stop
- GET /api/tasks/status
- GET /api/tasks/detailed-status

### Files
- POST /api/files/upload
- GET /api/files
- GET /api/files/session/{session_id}/list-all-files
- GET /api/files/{file_id}
- DELETE /api/files/{file_id}

### Activity
- GET /api/activity/sessions/{session_id}/latest-activity
- GET /api/activity/tasks
- GET /api/activity/sessions
- GET /api/activity/{task_id}

### Config
- GET /api/config/llm-profiles
- POST /api/config/llm-profiles
- PUT /api/config/llm-profiles/{profile_name}
- DELETE /api/config/llm-profiles/{profile_name}
- GET /api/config/llm-profiles/default/current
- GET /api/config/providers
- GET /api/config/providers/{provider}/models
- GET /api/config/environments
- PUT /api/config/environments

### Browser
- GET /api/browser/active-tab
- GET /api/browser/all-tabs

### Voice
- GET /api/voices/voice-profiles
- POST /api/voices/voice-profiles
- PUT /api/voices/voice-profiles/{name}
- DELETE /api/voices/voice-profiles/{name}
- GET /api/voices/models

## Integration

To use this enhanced UI, replace the web_ui files in Dockerfile_WEB with these enhanced versions.

## Features in Detail

### 1. File Upload
- Multiple file selection
- Upload to `/api/files/upload`
- Progress indication
- File list display
- Pass uploaded file paths to tasks

### 2. Task History
- Shows all completed tasks
- Filter by session ID
- View task details and results
- Refresh and clear options

### 3. Detailed Status
- Real-time progress percentage
- Current action display
- Agent status information
- Time elapsed tracking

### 4. LLM Profile Selector
- Dropdown with all available profiles
- Create new profiles via modal
- Select provider and model
- Set API keys

### 5. Browser Tab Viewer
- List all open browser tabs
- Show active tab
- Tab URL and title
- Refresh capability

### 6. Settings Panel
- LLM profile management
- Environment variable viewer/editor
- Voice profile configuration
- System information

## Usage

1. **Submit a Task**:
   - Select LLM profile
   - Choose agent mode
   - Upload files (optional)
   - Enter task description
   - Click Submit

2. **Monitor Progress**:
   - Watch detailed status
   - See real-time activity log
   - View progress percentage

3. **Control Execution**:
   - Pause/Resume as needed
   - Stop if required
   - View results when complete

4. **View History**:
   - Switch to History tab
   - Filter by session
   - Review past tasks

5. **Check Browser**:
   - Switch to Browser tab
   - See all open tabs
   - Identify active tab

6. **Configure Settings**:
   - Switch to Settings tab
   - Manage profiles
   - View/edit environment
   - Configure voice

## Development

### Adding New Features

1. Add HTML elements in `index.html`
2. Style in `style.css`
3. Implement API calls in `app.js`
4. Test thoroughly

### API Integration Pattern

```javascript
// Standard API call pattern
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(endpoint, options);
    if (!response.ok) throw new Error(await response.text());
    return await response.json();
}
```

## Browser Compatibility

- Chrome/Chromium: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Edge: ✅ Full support
- Mobile: ✅ Responsive design

## Known Limitations

1. File uploads are temporarily stored in backend
2. Voice features require browser microphone access
3. Browser tab control limited to viewing (no direct manipulation)
4. Environment variable changes require backend restart

## Future Enhancements

- WebSocket for real-time updates (instead of polling)
- Drag-and-drop file upload
- Task templates/favorites
- Export task results
- Dark/Light theme toggle
- Multi-language support

## Support

For issues or questions:
- Check `/docs` for API documentation
- Review backend logs in HuggingFace Spaces
- Test API endpoints individually

## License

Same as VibeSurf main project (Apache 2.0 with additional conditions)
