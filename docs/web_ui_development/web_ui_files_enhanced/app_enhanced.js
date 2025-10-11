// VibeSurf Pro - Enhanced Web UI v2.0
// Complete implementation with all 6 features

// Global State
let currentSessionId = null;
let currentTaskId = null;
let activityPolling = null;
let statusPolling = null;
let uploadedFilePaths = [];
let availableProfiles = [];
let availableProviders = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await checkBackendStatus();
    await generateSessionId();
    await loadLLMProfiles();
    setupTabNavigation();
    setupFileUpload();
    
    // Start polling
    setInterval(pollDetailedStatus, 3000);
});

// ============= FEATURE: TAB NAVIGATION =============
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) btn.classList.add('active');
    });
    
    // Update content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    const activeTab = document.getElementById('tab-' + tabName);
    if (activeTab) activeTab.classList.add('active');
    
    // Load tab-specific data
    if (tabName === 'history') loadHistory();
    if (tabName === 'browser') refreshBrowserTabs();
    if (tabName === 'settings') loadSettings();
}

// ============= CORE: BACKEND CONNECTION =============
async function checkBackendStatus() {
    try {
        const response = await fetch('/health');
        if (response.ok) {
            updateStatus('connected', 'Backend Connected');
        } else {
            updateStatus('error', 'Backend Error');
        }
    } catch (error) {
        updateStatus('error', 'Backend Offline');
        console.error('Health check failed:', error);
    }
}

async function generateSessionId() {
    try {
        const response = await fetch('/generate-session-id');
        const data = await response.json();
        currentSessionId = data.session_id;
        addLog('Session initialized: ' + currentSessionId);
    } catch (error) {
        addLog('Failed to generate session ID', 'error');
        console.error('Session generation failed:', error);
    }
}

// ============= FEATURE 1: FILE UPLOAD =============
function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);
        if (files.length > 0) {
            addLog(\`\${files.length} file(s) selected for upload\`);
        }
    });
}

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
            
            addLog(\`Uploaded \${files.length} file(s) successfully\`, 'success');
            displayUploadedFiles(data.files || []);
            fileInput.value = ''; // Clear input
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
    if (files.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = files.map(file => \`
        <div class="uploaded-file">
            <span>✓ \${file.filename || file.file_id}</span>
            <button onclick="deleteFile('\${file.file_id}')" class="btn-danger">🗑️</button>
        </div>
    \`).join('');
}

async function deleteFile(fileId) {
    try {
        const response = await fetch(\`/api/files/\${fileId}\`, { method: 'DELETE' });
        if (response.ok) {
            addLog('File deleted', 'success');
            // Reload files
            const fileInput = document.getElementById('file-input');
            fileInput.value = '';
            document.getElementById('uploaded-files-list').innerHTML = '';
            uploadedFilePaths = [];
        }
    } catch (error) {
        addLog('Delete failed: ' + error.message, 'error');
    }
}

// ============= FEATURE 4: LLM PROFILE SELECTOR =============
async function loadLLMProfiles() {
    try {
        const response = await fetch('/api/config/llm-profiles');
        const profiles = await response.json();
        availableProfiles = profiles;
        
        const select = document.getElementById('llm-profile-select');
        select.innerHTML = profiles.map(p => 
            \`<option value="\${p.profile_name}">\${p.profile_name}</option>\`
        ).join('');
        
        // Get default
        try {
            const defaultResp = await fetch('/api/config/llm-profiles/default/current');
            if (defaultResp.ok) {
                const def = await defaultResp.json();
                select.value = def.profile_name;
            }
        } catch (e) {}
    } catch (error) {
        console.error('Failed to load profiles:', error);
        document.getElementById('llm-profile-select').innerHTML = 
            '<option value="default">default</option>';
    }
}

async function refreshLLMProfiles() {
    await loadLLMProfiles();
    addLog('LLM profiles refreshed');
}

// ============= CORE: TASK SUBMISSION =============
async function submitTask() {
    const taskInput = document.getElementById('task-input');
    const taskDescription = taskInput.value.trim();
    
    if (!taskDescription) {
        alert('Please enter a task');
        return;
    }
    
    if (!currentSessionId) await generateSessionId();
    
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Submitting...';
    
    try {
        const llmProfileName = document.getElementById('llm-profile-select').value;
        const agentMode = document.getElementById('agent-mode-select').value;
        
        const taskRequest = {
            session_id: currentSessionId,
            task_description: taskDescription,
            llm_profile_name: llmProfileName,
            agent_mode: agentMode
        };
        
        if (uploadedFilePaths.length > 0) {
            taskRequest.upload_files_path = uploadedFilePaths.join(',');
        }
        
        const response = await fetch('/api/tasks/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskRequest)
        });
        
        if (response.ok) {
            const data = await response.json();
            currentTaskId = data.task_id;
            addLog('Task submitted successfully!', 'success');
            addLog('Task ID: ' + currentTaskId);
            
            taskInput.value = '';
            uploadedFilePaths = [];
            document.getElementById('uploaded-files-list').innerHTML = '';
            
            document.getElementById('pause-btn').disabled = false;
            document.getElementById('stop-btn').disabled = false;
            
            startActivityPolling();
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            addLog('Task failed: ' + (errorData.detail || errorData.message), 'error');
        }
    } catch (error) {
        addLog('Error: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '▶️ Submit Task';
    }
}

async function pauseTask() {
    await sendControl('/api/tasks/pause', 'Task paused');
    document.getElementById('resume-btn').disabled = false;
    document.getElementById('pause-btn').disabled = true;
}

async function resumeTask() {
    await sendControl('/api/tasks/resume', 'Task resumed');
    document.getElementById('pause-btn').disabled = false;
    document.getElementById('resume-btn').disabled = true;
}

async function stopTask() {
    await sendControl('/api/tasks/stop', 'Task stopped');
    stopActivityPolling();
    document.getElementById('pause-btn').disabled = true;
    document.getElementById('resume-btn').disabled = true;
    document.getElementById('stop-btn').disabled = true;
}

async function sendControl(endpoint, successMessage) {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ reason: successMessage })
        });
        
        if (response.ok) {
            addLog(successMessage, 'success');
        } else {
            const errorData = await response.json().catch(() => ({ detail: 'Failed' }));
            addLog('Control failed: ' + (errorData.detail || ''), 'error');
        }
    } catch (error) {
        addLog('Error: ' + error.message, 'error');
    }
}

// ============= FEATURE 3: DETAILED STATUS =============
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
    
    container.innerHTML = \`
        <div class="status-card">
            <div class="status-row">
                <span>Task ID:</span>
                <span>\${status.task_id?.slice(0, 8) || 'N/A'}</span>
            </div>
            <div class="status-row">
                <span>Status:</span>
                <span class="status-badge \${status.status}">\${status.status}</span>
            </div>
            <div class="status-row">
                <span>Progress:</span>
                <span>\${progress}%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: \${progress}%"></div>
            </div>
            <div class="status-row">
                <span>Current Action:</span>
                <span>\${currentAction}</span>
            </div>
        </div>
    \`;
}

// ============= ACTIVITY POLLING =============
function startActivityPolling() {
    if (activityPolling) return;
    activityPolling = setInterval(async () => {
        try {
            const response = await fetch(\`/api/activity/sessions/\${currentSessionId}/latest_activity\`);
            if (response.ok) {
                const activities = await response.json();
                if (activities && activities.length > 0) {
                    activities.forEach(activity => {
                        addLog(\`[\${activity.agent_name}] \${activity.action}: \${activity.result || ''}\`);
                    });
                }
            }
        } catch (error) {
            console.error('Activity polling error:', error);
        }
    }, 2000);
}

function stopActivityPolling() {
    if (activityPolling) {
        clearInterval(activityPolling);
        activityPolling = null;
    }
}

// ============= FEATURE 2: TASK HISTORY =============
async function loadHistory() {
    try {
        const sessionFilter = document.getElementById('session-filter').value;
        let tasks = [];
        
        if (sessionFilter === 'current') {
            const response = await fetch(\`/api/activity/sessions/\${currentSessionId}/tasks\`);
            tasks = await response.json();
        } else {
            const response = await fetch('/api/activity/tasks');
            tasks = await response.json();
        }
        
        displayHistory(tasks);
        document.getElementById('history-count').textContent = \`\${tasks.length} tasks\`;
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
    
    container.innerHTML = tasks.map(task => \`
        <div class="history-item">
            <div class="history-header">
                <span class="task-id">\${task.task_id.slice(0, 8)}</span>
                <span class="status-badge \${task.status}">\${task.status}</span>
                <span class="task-time">\${new Date(task.created_at).toLocaleString()}</span>
            </div>
            <div class="history-body">
                <p><strong>Task:</strong> \${task.task_description || 'N/A'}</p>
                \${task.result ? \`<p><strong>Result:</strong> \${task.result.slice(0, 200)}...</p>\` : ''}
            </div>
            <div class="history-actions">
                <button onclick="viewTaskDetails('\${task.task_id}')" class="btn-secondary">📋 Details</button>
            </div>
        </div>
    \`).join('');
}

function filterHistory() {
    loadHistory();
}

async function viewTaskDetails(taskId) {
    try {
        const response = await fetch(\`/api/activity/\${taskId}\`);
        const task = await response.json();
        
        document.getElementById('task-details-content').innerHTML = \`
            <pre>\${JSON.stringify(task, null, 2)}</pre>
        \`;
        document.getElementById('task-details-modal').classList.add('active');
    } catch (error) {
        alert('Failed to load task details: ' + error.message);
    }
}

function closeTaskDetailsModal() {
    document.getElementById('task-details-modal').classList.remove('active');
}

// ============= FEATURE 5: BROWSER TAB VIEWER =============
async function refreshBrowserTabs() {
    try {
        const response = await fetch('/api/browser/all-tabs');
        const tabs = await response.json();
        
        displayBrowserTabs(tabs.tabs || tabs || []);
        document.getElementById('tabs-count').textContent = \`\${(tabs.tabs || tabs || []).length} tabs\`;
    } catch (error) {
        addLog('Failed to get browser tabs: ' + error.message, 'error');
        document.getElementById('browser-tabs').innerHTML = 
            '<p class="placeholder">Failed to load tabs. Browser may not be running.</p>';
    }
}

function displayBrowserTabs(tabs) {
    const container = document.getElementById('browser-tabs');
    
    if (!tabs || tabs.length === 0) {
        container.innerHTML = '<p class="placeholder">No browser tabs open</p>';
        return;
    }
    
    container.innerHTML = tabs.map((tab, index) => \`
        <div class="browser-tab \${tab.is_active ? 'active' : ''}">
            <div class="tab-index">\${index + 1}</div>
            <div class="tab-info">
                <div class="tab-title">\${tab.title || 'Untitled'}</div>
                <div class="tab-url">\${tab.url || 'about:blank'}</div>
            </div>
            \${tab.is_active ? '<span class="active-badge">Active</span>' : ''}
        </div>
    \`).join('');
}

async function getActiveTab() {
    try {
        const response = await fetch('/api/browser/active-tab');
        const tab = await response.json();
        addLog(\`Active tab: \${tab.title || 'Unknown'} (\${tab.url || 'N/A'})\`, 'success');
    } catch (error) {
        addLog('Failed to get active tab: ' + error.message, 'error');
    }
}

// ============= FEATURE 6: SETTINGS PANEL =============
async function loadSettings() {
    await loadLLMProfilesList();
    await loadProviders();
    await loadFiles();
}

async function loadLLMProfilesList() {
    try {
        const response = await fetch('/api/config/llm-profiles');
        const profiles = await response.json();
        
        const container = document.getElementById('llm-profiles-list');
        container.innerHTML = profiles.map(profile => \`
            <div class="profile-item">
                <div class="profile-info">
                    <strong>\${profile.profile_name}</strong>
                    <span>\${profile.model_name || 'Unknown Model'}</span>
                </div>
                <div class="profile-actions">
                    <button onclick="deleteProfile('\${profile.profile_name}')" class="btn-danger">🗑️ Delete</button>
                </div>
            </div>
        \`).join('');
    } catch (error) {
        console.error('Failed to load profiles list:', error);
    }
}

async function loadProviders() {
    try {
        const response = await fetch('/api/config/providers');
        const providers = await response.json();
        availableProviders = providers;
        
        const container = document.getElementById('providers-list');
        container.innerHTML = Object.entries(providers).map(([name, info]) => \`
            <div class="provider-item">
                <div class="provider-info">
                    <strong>\${name}</strong>
                    <span>\${info.endpoint || 'N/A'}</span>
                </div>
            </div>
        \`).join('');
        
        // Also populate modal dropdown
        const providerSelect = document.getElementById('profile-provider');
        providerSelect.innerHTML = '<option value="">Select Provider</option>' +
            Object.keys(providers).map(name => \`<option value="\${name}">\${name}</option>\`).join('');
    } catch (error) {
        console.error('Failed to load providers:', error);
    }
}

async function loadFiles() {
    try {
        const response = await fetch('/api/files');
        const files = await response.json();
        
        const container = document.getElementById('files-list');
        if (!files || files.length === 0) {
            container.innerHTML = '<p class="placeholder">No uploaded files</p>';
            return;
        }
        
        container.innerHTML = files.map(file => \`
            <div class="file-item">
                <span>\${file.filename || file.file_id}</span>
                <button onclick="deleteFile('\${file.file_id}')" class="btn-danger">🗑️</button>
            </div>
        \`).join('');
    } catch (error) {
        console.error('Failed to load files:', error);
    }
}

function showCreateProfileModal() {
    document.getElementById('create-profile-modal').classList.add('active');
    if (availableProviders.length === 0) loadProviders();
}

function closeCreateProfileModal() {
    document.getElementById('create-profile-modal').classList.remove('active');
    document.getElementById('create-profile-form').reset();
}

async function loadProviderModels() {
    const provider = document.getElementById('profile-provider').value;
    if (!provider) return;
    
    try {
        const response = await fetch(\`/api/config/providers/\${provider}/models\`);
        const models = await response.json();
        
        const modelSelect = document.getElementById('profile-model');
        modelSelect.innerHTML = models.map(m => \`<option value="\${m}">\${m}</option>\`).join('');
    } catch (error) {
        console.error('Failed to load models:', error);
    }
}

async function createLLMProfile(event) {
    event.preventDefault();
    
    const profileData = {
        profile_name: document.getElementById('profile-name').value,
        provider_name: document.getElementById('profile-provider').value,
        model_name: document.getElementById('profile-model').value,
        api_endpoint: document.getElementById('profile-endpoint').value || undefined,
        api_key: document.getElementById('profile-api-key').value || undefined
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
            await loadLLMProfiles();
            await loadLLMProfilesList();
        } else {
            const error = await response.text();
            addLog('Failed to create profile: ' + error, 'error');
        }
    } catch (error) {
        addLog('Error creating profile: ' + error.message, 'error');
    }
}

async function deleteProfile(profileName) {
    if (!confirm(\`Delete profile "\${profileName}"?\`)) return;
    
    try {
        const response = await fetch(\`/api/config/llm-profiles/\${profileName}\`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            addLog('Profile deleted', 'success');
            await loadLLMProfiles();
            await loadLLMProfilesList();
        } else {
            throw new Error(await response.text());
        }
    } catch (error) {
        addLog('Delete failed: ' + error.message, 'error');
    }
}

// ============= UI HELPERS =============
function updateStatus(state, text) {
    const indicator = document.getElementById('status-indicator');
    const statusText = document.getElementById('status-text');
    indicator.className = 'status-indicator ' + state;
    statusText.textContent = text;
}

function addLog(message, type = 'info') {
    const logContainer = document.getElementById('activity-log');
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    
    const timestamp = new Date().toLocaleTimeString();
    entry.innerHTML = \`<span class="log-timestamp">\${timestamp}</span>\${message}\`;
    
    logContainer.appendChild(entry);
    logContainer.scrollTop = logContainer.scrollHeight;
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        const activeTab = document.querySelector('.tab-content.active');
        if (activeTab && activeTab.id === 'tab-tasks') {
            submitTask();
        }
    }
});
