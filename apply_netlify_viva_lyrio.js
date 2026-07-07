const fs = require('fs');

const path = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(path, 'utf8');

html = html.replace("fetch('http://localhost:3000/process_payment', {", "fetch('/.netlify/functions/process_payment', {");

fs.writeFileSync(path, html, 'utf8');
console.log('viva_lyrio.html updated to use Netlify Functions route!');
