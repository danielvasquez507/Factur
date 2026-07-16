const fs = require('fs');
const lines = fs.readFileSync('/home/dany/.gemini/antigravity/brain/a1d2ae2c-1b34-46d9-bdd4-165f3c28e3b7/.system_generated/logs/transcript_full.jsonl', 'utf-8').split('\n');
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT' && obj.content && obj.content.toLowerCase().includes('dentro del menu flotante')) {
      const idx = obj.content.indexOf('<!-- Floating App Button -->');
      console.log("Floating App Button index:", idx);
      const idx2 = obj.content.indexOf('fixed top-4 right-4 z-[100]');
      console.log("fixed top-4 right-4 z-[100] index:", idx2);
      
      const idx3 = obj.content.indexOf('<a ');
      const match = obj.content.substring(idx2 - 100, idx2 + 500);
      console.log(match);
      break;
    }
  } catch (e) {}
}
