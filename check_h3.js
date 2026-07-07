const fs = require('fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;
const cards = doc.querySelectorAll('.livro-card');
cards.forEach(c => {
  const h3 = c.querySelector('h3');
  console.log(h3 ? h3.textContent.trim() : 'No h3');
});
