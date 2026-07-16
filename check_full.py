import json
import re

with open('/home/dany/.gemini/antigravity/brain/a1d2ae2c-1b34-46d9-bdd4-165f3c28e3b7/.system_generated/logs/transcript_full.jsonl', 'r') as f:
    lines = f.readlines()

for line in reversed(lines):
    data = json.loads(line)
    if data.get('type') == 'USER_INPUT':
        content = data.get('content', '')
        if '<!DOCTYPE html>' in content:
            if '<truncated' not in content:
                print("Found full HTML in transcript_full.jsonl!")
                start_idx = content.find('<!DOCTYPE html>')
                html_content = content[start_idx:]
                with open('/tmp/landing_full.html', 'w') as out:
                    out.write(html_content)
                break
            else:
                print("Found HTML but it contains <truncated> string.")
