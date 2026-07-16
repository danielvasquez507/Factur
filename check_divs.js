const fs = require('fs');
const content = fs.readFileSync('src/components/landing/landing-content.tsx', 'utf-8');
const open = (content.match(/<div(\s|>)/g) || []).length;
const close = (content.match(/<\/div>/g) || []).length;
console.log('Open:', open, 'Close:', close);
