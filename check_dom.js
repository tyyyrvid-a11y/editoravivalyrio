const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const varejo = document.getElementById('varejo-section');
if (varejo) {
  const items = varejo.querySelectorAll('.radio-item');
  items.forEach((item, i) => {
    const input = item.querySelector('input');
    const title = item.querySelector('.radio-title') ? item.querySelector('.radio-title').textContent : 'No title';
    console.log(`Item ${i}: value=${input ? input.value : 'none'}, title=${title.trim()}`);
  });
} else {
  console.log('No varejo-section found.');
}
