const fs = require('fs');

const htmlPath = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace(
  "pix: 'all',",
  "bankTransfer: 'all',"
);

fs.writeFileSync(htmlPath, html);
console.log('Pix configuration fixed (bankTransfer: all)');
