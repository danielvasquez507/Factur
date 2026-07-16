const fs = require('fs');
let content = fs.readFileSync('src/components/landing/landing-content.tsx', 'utf-8');
content = content.replace(/<\/main><\/div>\);\s*\}/, '</main></div></div>); }');
fs.writeFileSync('src/components/landing/landing-content.tsx', content);
console.log("Fixed div");
