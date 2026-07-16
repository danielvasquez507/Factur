const fs = require('fs');
const content = fs.readFileSync('/home/dany/.gemini/antigravity/brain/a1d2ae2c-1b34-46d9-bdd4-165f3c28e3b7/.system_generated/logs/transcript_full.jsonl', 'utf-8');
const lines = content.split('\n');
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('<html lang="es">')) {
      fs.writeFileSync('/tmp/found_html.html', obj.content);
      console.log('Saved to /tmp/found_html.html');
    }
  } catch (e) {}
}
