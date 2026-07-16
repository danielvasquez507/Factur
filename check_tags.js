const fs = require('fs');
const content = fs.readFileSync('src/components/landing/landing-content.tsx', 'utf-8');
const tags = ['div', 'main', 'section', 'svg', 'path', 'button', 'input', 'h1', 'h2', 'h3', 'p', 'span', 'strong', 'ul', 'li', 'a', 'text', 'tspan'];
for (const tag of tags) {
  const open = (content.match(new RegExp(`<${tag}(\\s|>)`, 'g')) || []).length;
  const close = (content.match(new RegExp(`</${tag}>`, 'g')) || []).length;
  if (open !== close && tag !== 'input' && tag !== 'path') {
    console.log(`${tag} -> Open: ${open} Close: ${close}`);
  }
}
