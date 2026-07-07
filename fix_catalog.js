const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlPath = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Extract the Base64 images from the HTML
const dom = new JSDOM(html);
const doc = dom.window.document;
const imgs = doc.querySelectorAll('.livro-cover img');

const imgLaura = imgs[0] ? imgs[0].src : '';
const imgVila = imgs[1] ? imgs[1].src : '';
const imgLipe = imgs[2] ? imgs[2].src : '';
const imgArarinha = imgs[3] ? imgs[3].src : '';

// 2. Rebuild the catalog object correctly
const catalogoCorreto = [
  { id: 'qtd-laura-flex', title: 'Meu Nome é Laura (Capa Flexível)', price: 59.90, image: imgLaura },
  { id: 'qtd-laura-dura', title: 'Meu Nome é Laura (Capa Dura)', price: 79.90, image: imgLaura },
  { id: 'qtd-vila-flex', title: 'A Vila do Ser (Capa Flexível)', price: 79.99, image: imgVila },
  { id: 'qtd-vila-dura', title: 'A Vila do Ser (Capa Dura)', price: 99.90, image: imgVila },
  { id: 'qtd-lipe', title: 'Lipe vai à Terapia', price: 25.00, image: imgLipe },
  { id: 'qtd-ararinha', title: 'Para Sempre Ararinha (Capa Mole)', price: 59.99, image: imgArarinha }
];

// 3. Find the old catalogo declaration and replace it
// The old one looks like: const catalogo = [{"id":"qtd-laura-flex","title":"Meu Nome ? Laura (Flex?vel)","price":59.9,"image":""},...];
const startIdx = html.indexOf('const catalogo = [');
if (startIdx !== -1) {
  const endIdx = html.indexOf('];', startIdx);
  if (endIdx !== -1) {
    const newCatalogoStr = 'const catalogo = ' + JSON.stringify(catalogoCorreto, null, 2) + ';';
    html = html.substring(0, startIdx) + newCatalogoStr + html.substring(endIdx + 2);
    
    fs.writeFileSync(htmlPath, html);
    console.log('Catalogo successfully replaced with correct text encoding and base64 images!');
  } else {
    console.log('Could not find the end of catalogo array.');
  }
} else {
  console.log('Could not find const catalogo in the file.');
}
