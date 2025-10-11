#!/usr/bin/env python3
"""
Build script to create Dockerfile_WEB_ENHANCED_COMPLETE
This script reads Dockerfile_WEB and injects enhanced web UI files
"""

import re
import os

print("Building enhanced Dockerfile with all 6 features...")

# Change to script directory
script_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.dirname(script_dir)
os.chdir(project_dir)

print(f"Working in: {os.getcwd()}")

# Read base Dockerfile
print("Reading Dockerfile_WEB...")
with open('Dockerfile_WEB', 'r') as f:
    content = f.read()

# Read enhanced UI files
print("Reading enhanced HTML...")
with open('web_ui_files_enhanced/index_enhanced.html', 'r') as f:
    enhanced_html = f.read()

print("Reading enhanced CSS...")
with open('web_ui_files_enhanced/style_enhanced.css', 'r') as f:
    enhanced_css = f.read()

print("Reading enhanced JavaScript...")
with open('web_ui_files_enhanced/app_enhanced.js', 'r') as f:
    enhanced_js = f.read()

# Replace HTML section
print("Replacing HTML section...")
html_pattern = r"(RUN mkdir -p \$HOME/app/web_ui && cat > \$HOME/app/web_ui/index\.html <<'HTMLEOF'\n)(.*?)(^HTMLEOF)"
content = re.sub(html_pattern, r'\1' + enhanced_html + r'\n\3', content, flags=re.DOTALL | re.MULTILINE)

# Replace CSS section
print("Replacing CSS section...")  
css_pattern = r"(RUN cat > \$HOME/app/web_ui/style\.css <<'CSSEOF'\n)(.*?)(^CSSEOF)"
content = re.sub(css_pattern, r'\1' + enhanced_css + r'\n\3', content, flags=re.DOTALL | re.MULTILINE)

# Replace JS section
print("Replacing JavaScript section...")
js_pattern = r"(RUN cat > \$HOME/app/web_ui/app\.js <<'JSEOF'\n)(.*?)(^JSEOF)"
content = re.sub(js_pattern, r'\1' + enhanced_js + r'\n\3', content, flags=re.DOTALL | re.MULTILINE)

# Write enhanced Dockerfile
print("Writing Dockerfile_WEB_ENHANCED_COMPLETE...")
with open('Dockerfile_WEB_ENHANCED_COMPLETE', 'w') as f:
    f.write(content)

file_size = os.path.getsize('Dockerfile_WEB_ENHANCED_COMPLETE')
print(f"\n✅ Created Dockerfile_WEB_ENHANCED_COMPLETE ({file_size} bytes)")
print("\n🎯 Features included:")
print("  1. ✅ File Upload & Management")
print("  2. ✅ Task History with Filtering")
print("  3. ✅ Detailed Status with Progress")
print("  4. ✅ LLM Profile Selector & Management")
print("  5. ✅ Browser Tab Viewer & Control")
print("  6. ✅ Complete Settings Panel")
print("\n📋 To deploy:")
print("  cp Dockerfile_WEB_ENHANCED_COMPLETE Dockerfile")
print("  git add Dockerfile")
print("  git commit -m 'Deploy VibeSurf Pro with all 6 enhanced features'")
print("  git push")
print("\n🧪 To test locally:")
print("  docker build -f Dockerfile_WEB_ENHANCED_COMPLETE -t vibesurf-pro .")
print("  docker run -p 7860:7860 -e OPENAI_API_KEY=sk-... vibesurf-pro")
