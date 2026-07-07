const fs = require('fs');
const path = 'c:\\Users\\Artur\\Downloads\\files\\netlify\\functions\\process_payment.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace("const fetch = require('node-fetch');", "// Node 18+ tem fetch nativo, sem dependencias!");

fs.writeFileSync(path, content, 'utf8');
console.log('node-fetch removido!');
