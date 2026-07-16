const fs = require('fs');
const lines = fs.readFileSync('/home/dany/.gemini/antigravity/brain/a1d2ae2c-1b34-46d9-bdd4-165f3c28e3b7/.system_generated/logs/transcript_full.jsonl', 'utf-8').split('\n');
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.includes('<title>Factur - Gestión y Facturación Profesional</title>')) {
      fs.writeFileSync('/tmp/original_html.html', obj.content);
      console.log('Saved to /tmp/original_html.html');
      break;
    }
  } catch (e) {}
}
