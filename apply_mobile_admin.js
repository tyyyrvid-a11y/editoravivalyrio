const fs = require('fs');
const path = 'c:\\Users\\Artur\\Downloads\\files\\admin.html';
let html = fs.readFileSync(path, 'utf8');

const oldCSS = `.posts-table {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: var(--radius);
    box-shadow: var(--shadow);`;

const newCSS = `.posts-table {
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.6);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow-x: auto;`;

html = html.replace(oldCSS, newCSS);
fs.writeFileSync(path, html, 'utf8');
console.log('admin.html mobile optimization done!');
