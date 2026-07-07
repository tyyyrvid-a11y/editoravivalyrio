const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const books = [];
const cards = doc.querySelectorAll('.livro-card');
cards.forEach((card, i) => {
  const img = card.querySelector('img');
  const title = card.querySelector('h3');
  
  if (img && title) {
    books.push({
      id: 'book_' + i,
      title: title.textContent.trim(),
      image: img.src
    });
  }
});

// Since price is separated by Capa Dura/Flexivel, we will map them based on the precos object from original script
const precosMap = [
  { id: 'qtd-laura-flex', title: 'Meu Nome é Laura (Flexível)', price: 59.90, baseImgTitle: 'Meu Nome é Laura' },
  { id: 'qtd-laura-dura', title: 'Meu Nome é Laura (Capa Dura)', price: 79.90, baseImgTitle: 'Meu Nome é Laura' },
  { id: 'qtd-vila-flex', title: 'A Vila do Ser (Flexível)', price: 79.99, baseImgTitle: 'A Vila do Ser' },
  { id: 'qtd-vila-dura', title: 'A Vila do Ser (Capa Dura)', price: 99.90, baseImgTitle: 'A Vila do Ser' },
  { id: 'qtd-lipe', title: 'Lipe vai à Terapia', price: 25.00, baseImgTitle: 'Lipe vai' },
  { id: 'qtd-ararinha', title: 'Para Sempre Ararinha (Capa Mole)', price: 59.99, baseImgTitle: 'Para Sempre Ararinha' }
];

const finalBooks = precosMap.map(p => {
  // Find matching image from books
  const match = books.find(b => b.title.includes(p.baseImgTitle) || p.baseImgTitle.includes(b.title.split(' ')[0]));
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    image: match ? match.image : ''
  };
});

fs.writeFileSync('books.json', JSON.stringify(finalBooks, null, 2));
console.log('Books extracted successfully!');
