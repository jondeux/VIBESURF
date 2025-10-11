# VibeSurf Web UI Enhancement Guide

## 🎯 Current Status

**Dockerfile_WEB** is working with basic features:
- ✅ Task submission (JSON format, correct fields)
- ✅ Real-time activity polling
- ✅ Pause/Resume/Stop controls
- ✅ Status indicator
- ✅ Modern responsive UI

## 🚀 Requested Enhancements

### 1. File Upload (Working)

**Current**: Button exists but doesn't upload  
**Enhancement**: Implement actual file upload

```javascript
// Add to app.js
let uploadedFilePaths = [];

async function uploadFiles() {
    const fileInput = document.getElementById('file-input');
    const files = fileInput.files;
    
    if (files.length === 0) {
        alert('Please select files first');
        return;
    }
    
    const uploadBtn = document.getElementById('upload-btn');
    uploadBtn.disabled = true;
    uploadBtn.textContent = '⏳ Uploading...';
    
    try {
        const formData = new FormData();
        for (const file of files) {
            formData.append('files', file);
        }
        
        const response = await fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            const data = await response.json();
            uploadedFilePaths = data.file_paths || [];
            
            addLog(`Uploaded ${files.length} file(s) successfully`, 'success');
            displayUploadedFiles(data.files);
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        addLog('File upload failed: ' + error.message, 'error');
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = '📎 Upload Files';
    }
}

function displayUploadedFiles(files) {
    const container = document.getElementById('uploaded-files-list');
    container.innerHTML = files.map(file => `
        <div class="uploaded-file">
            <span>✓ ${file.filename}</span>
            <button onclick="deleteFile('${file.file_id}')">🗑️</button>
        </div>
    `).join('');
}

// Then in submitTask(), add:
if (uploadedFilePaths.length > 0) {
    taskRequest.upload_files_path = uploadedFilePaths.join(',');
}
```

### 2. Task History

**Enhancement**: Add history tab to view past tasks

```javascript
// Add to app.js
async function loadHistory() {
    try {
        // Get all sessions
        const sessionsResp = await fetch('/api/activity/sessions');
        const sessions = await sessionsResp.json();
        
        // Get tasks for current session
        const tasksResp = await fetch(`/api/activity/sessions/${currentSessionId}/tasks`);
        const tasks = await tasksResp.json();
        
        displayHistory(tasks);
    } catch (error) {
        addLog('Failed to load history: ' + error.message, 'error');
    }
}

function displayHistory(tasks) {
    const container = document.getElementById('history-list');
    
    if (!tasks || tasks.length === 0) {
        container.innerHTML = '<p class="placeholder">No task history</p>';
        return;
    }
    
    container.innerHTML = tasks.map(task => `
        <div class="history-item">
            <div class="history-header">
                <span class="task-id">${task.task_id.slice(0, 8)}</span>
                <span class="task-status ${task.status}">${task.status}</span>
                <span class="task-time">${new Date(task.created_at).toLocaleString()}</span>
            </div>
            <div class="history-body">
                <p><strong>Task:</strong> ${task.task_description}</p>
                ${task.result ? `<p><strong>Result:</strong> ${task.result}</p>` : ''}
            </div>
            <div class="history-actions">
                <button onclick="viewTaskDetails('${task.task_id}')">📋 Details</button>
                <button onclick="rerunTask('${task.task_id}')">🔄 Rerun</button>
            </div>
        </div>
    `).join('');
}

async function viewTaskDetails(taskId) {
    const response = await fetch(`/api/activity/${taskId}`);
    const task = await response.json();
    
    // Display in modal or dedicated section
    alert(JSON.stringify(task, null, 2));
}
```

### 3. Detailed Status with Progress

**Enhancement**: Show detailed task status with progress bar

```javascript
// Add to app.js
async function pollDetailedStatus() {
    if (!currentTaskId) return;
    
    try {
        const response = await fetch('/api/tasks/detailed-status');
        if (response.ok) {
            const status = await response.json();
            updateDetailedStatus(status);
        }
    } catch (error) {
        console.error('Status polling error:', error);
    }
}

function updateDetailedStatus(status) {
    const container = document.getElementById('detailed-status');
    
    if (!status || !status.has_active_task) {
        container.innerHTML = '<p class="placeholder">No active task</p>';
        return;
    }
    
    const progress = status.progress || 0;
    const currentAction = status.current_action || 'Processing...';
    
    container.innerHTML = `
        <div class="status-card">
            <div class="status-row">
                <span>Task ID:</span>
                <span>${status.task_id?.slice(0, 8) || 'N/A'}</span>
            </div>
            <div class="status-row">
                <span>Status:</span>
                <span class="status-badge ${status.status}">${status.status}</span>
            </div>
            <div class="status-row">
                <span>Progress:</span>
                <span>${progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progress}%"></div>
            </div>
            <div class="status-row">
                <span>Current Action:</span>
                <span>${currentAction}</span>
            </div>
            ${status.agent_statuses ? `
                <div class="agent-statuses">
                    <h4>Agents:</h4>
                    ${status.agent_statuses.map(agent => `
                        <div class="agent-status">
                            <span>${agent.agent_id}</span>
                            <span class="status-badge">${agent.status}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

// Poll every 2 seconds
setInterval(pollDetailedStatus, 2000);
```

### 4. LLM Profile Selector

**Enhancement**: Dropdown to select LLM profile

```javascript
// Add to app.js
async function loadLLMProfiles() {
    try {
        const response = await fetch('/api/config/llm-profiles');
        const profiles = await response.json();
        
        const select = document.getElementById('llm-profile-select');
        select.innerHTML = profiles.map(profile => `
            <option value="${profile.profile_name}">${profile.profile_name}</option>
        `).join('');
        
        // Get default profile
        const defaultResp = await fetch('/api/config/llm-profiles/default/current');
        if (defaultResp.ok) {
            const defaultProfile = await defaultResp.json();
            select.value = defaultProfile.profile_name;
        }
    } catch (error) {
        console.error('Failed to load LLM profiles:', error);
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', () => {
    loadLLMProfiles();
    // ... other init code
});

// In submitTask(), use selected profile:
const llmProfileName = document.getElementById('llm-profile-select').value;
```

### 5. Browser Tab Viewer

**Enhancement**: Show active browser tabs

```javascript
// Add to app.js
async function refreshBrowserTabs() {
    try {
        const response = await fetch('/api/browser/all-tabs');
        const tabs = await response.json();
        
        displayBrowserTabs(tabs);
    } catch (error) {
        addLog('Failed to get browser tabs: ' + error.message, 'error');
    }
}

function displayBrowserTabs(tabs) {
    const container = document.getElementById('browser-tabs');
    
    if (!tabs || tabs.length === 0) {
        container.innerHTML = '<p class="placeholder">No browser tabs open</p>';
        return;
    }
    
    container.innerHTML = tabs.map((tab, index) => `
        <div class="browser-tab ${tab.is_active ? 'active' : ''}">
            <div class="tab-index">${index + 1}</div>
            <div class="tab-info">
                <div class="tab-title">${tab.title || 'Untitled'}</div>
                <div class="tab-url">${tab.url}</div>
            </div>
            ${tab.is_active ? '<span class="active-badge">Active</span>' : ''}
        </div>
    `).join('');
}

async function getActiveTab() {
    try {
        const response = await fetch('/api/browser/active-tab');
        const tab = await response.json();
        
        addLog(`Active tab: ${tab.title} (${tab.url})`, 'success');
    } catch (error) {
        addLog('Failed to get active tab: ' + error.message, 'error');
    }
}
```

### 6. Settings Panel

**Enhancement**: Full settings management

```javascript
// Add to app.js

// LLM Profiles Management
async function loadLLMProfilesList() {
    const response = await fetch('/api/config/llm-profiles');
    const profiles = await response.json();
    
    const container = document.getElementById('llm-profiles-list');
    container.innerHTML = profiles.map(profile => `
        <div class="profile-item">
            <div class="profile-info">
                <strong>${profile.profile_name}</strong>
                <span>${profile.model_name}</span>
            </div>
            <div class="profile-actions">
                <button onclick="editProfile('${profile.profile_name}')">✏️ Edit</button>
                <button onclick="deleteProfile('${profile.profile_name}')">🗑️ Delete</button>
                <button onclick="setDefaultProfile('${profile.profile_name}')">⭐ Set Default</button>
            </div>
        </div>
    `).join('');
}

async function createLLMProfile(event) {
    event.preventDefault();
    
    const profileData = {
        profile_name: document.getElementById('profile-name').value,
        provider_name: document.getElementById('profile-provider').value,
        model_name: document.getElementById('profile-model').value,
        api_key: document.getElementById('profile-api-key').value
    };
    
    try {
        const response = await fetch('/api/config/llm-profiles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(profileData)
        });
        
        if (response.ok) {
            addLog('Profile created successfully', 'success');
            closeCreateProfileModal();
            loadLLMProfilesList();
            loadLLMProfiles(); // Refresh dropdown
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        addLog('Failed to create profile: ' + error.message, 'error');
    }
}

// Environment Variables
async function loadEnvironments() {
    try {
        const response = await fetch('/api/config/environments');
        const envs = await response.json();
        
        const container = document.getElementById('env-vars-list');
        container.innerHTML = Object.entries(envs).map(([key, value]) => `
            <div class="env-var">
                <span class="env-key">${key}</span>
                <span class="env-value">${value ? '••••••••' : '(not set)'}</span>
            </div>
        `).join('');
    } catch (error) {
        addLog('Failed to load environments: ' + error.message, 'error');
    }
}

// Voice Profiles
async function loadVoiceProfiles() {
    try {
        const response = await fetch('/api/voices/voice-profiles');
        const profiles = await response.json();
        
        const container = document.getElementById('voice-profiles-list');
        container.innerHTML = profiles.map(profile => `
            <div class="voice-profile">
                <span>${profile.profile_name}</span>
                <span>${profile.model_name}</span>
            </div>
        `).join('');
    } catch (error) {
        addLog('Failed to load voice profiles: ' + error.message, 'error');
    }
}
```

## 🎨 CSS Enhancements

Add to `style.css`:

```css
/* Tabs */
.nav-tabs {
    display: flex;
    background: #f5f5f5;
    padding: 10px;
    gap: 10px;
}

.tab-btn {
    padding: 10px 20px;
    border: none;
    background: white;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.3s;
}

.tab-btn.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.tab-content {
    display: none;
}

.tab-content.active {
    display: block;
}

/* Progress Bar */
.progress-bar {
    width: 100%;
    height: 20px;
    background: #e0e0e0;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    transition: width 0.5s ease;
}

/* History Items */
.history-item {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.history-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.task-status {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.9em;
}

.task-status.completed {
    background: #4caf50;
    color: white;
}

.task-status.running {
    background: #2196f3;
    color: white;
}

.task-status.failed {
    background: #f44336;
    color: white;
}

/* Browser Tabs */
.browser-tab {
    background: white;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
}

.browser-tab.active {
    border-left: 4px solid #4caf50;
}

.tab-index {
    width: 30px;
    height: 30px;
    background: #667eea;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
}

/* Modal */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
}

.modal.active {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
}

.close {
    float: right;
    font-size: 28px;
    cursor: pointer;
}

/* Settings Sections */
.settings-section {
    background: white;
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
}

.profile-item, .env-var, .voice-profile {
    padding: 15px;
    background: #f5f5f5;
    margin-bottom: 10px;
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* Form Controls */
.form-group {
    margin-bottom: 15px;
}

.form-control {
    width: 100%;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 1em;
}

.form-control:focus {
    outline: none;
    border-color: #667eea;
}
```

## 📋 Implementation Checklist

- [ ] Add file upload functionality
- [ ] Implement task history view
- [ ] Add detailed status with progress
- [ ] Create LLM profile selector
- [ ] Add browser tab viewer
- [ ] Implement settings panel
- [ ] Add tab navigation
- [ ] Create modal for profile creation
- [ ] Implement all API integrations
- [ ] Test all features thoroughly
- [ ] Update documentation

## 🚀 Quick Integration

To integrate these enhancements into Dockerfile_WEB:

1. Add HTML elements from enhancement sections
2. Copy CSS additions to style.css section
3. Add JavaScript functions to app.js section
4. Test locally before deploying to HuggingFace
5. Commit and push changes

## 📝 Next Steps

1. **Test Current Version**: Deploy Dockerfile_WEB and verify basic functionality works
2. **Add Features Incrementally**: Start with file upload, then history, etc.
3. **Test Each Feature**: Ensure API integration works before moving to next
4. **User Feedback**: Get feedback on each feature before finalizing

Would you like me to:
- A) Create a complete enhanced Dockerfile with all features (will be large)
- B) Create modular JavaScript modules you can integrate
- C) Prioritize specific features first (e.g., just file upload and history)
- D) Deploy current working version and iterate from there

