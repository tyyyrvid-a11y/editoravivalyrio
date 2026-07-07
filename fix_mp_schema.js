const fs = require('fs');

const htmlPath = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(htmlPath, 'utf8');

html = html.replace('formData.items = items;', '// formData.items = items;');
html = html.replace('formData.total = totalAmount;', '// formData.total = totalAmount;');

fs.writeFileSync(htmlPath, html);
console.log('Fixed Mercado Pago schema bug!');
