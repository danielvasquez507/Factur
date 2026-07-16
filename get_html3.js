const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
  const fileStream = fs.createReadStream('/home/dany/.gemini/antigravity/brain/a1d2ae2c-1b34-46d9-bdd4-165f3c28e3b7/.system_generated/logs/transcript_full.jsonl');

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let counter = 1;
  for await (const line of rl) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT' && obj.content) {
        fs.writeFileSync(`/tmp/user_input_${counter}.txt`, obj.content);
        console.log(`Saved /tmp/user_input_${counter}.txt (length: ${obj.content.length})`);
        counter++;
      }
    } catch (e) {}
  }
}

processLineByLine();
