const fs = require('fs');
const { JSDOM } = require('jsdom');

const htmlPath = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(htmlPath, 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

const brandGlassCss = `
<style id="brand-glass-cards">
  /* Laura: Purple #7B5EA7 */
  #showcase-laura {
    background: linear-gradient(135deg, rgba(123, 94, 167, 0.4) 0%, rgba(123, 94, 167, 0.1) 100%) !important;
    border: 1px solid rgba(123, 94, 167, 0.3) !important;
    box-shadow: 0 10px 40px rgba(123, 94, 167, 0.15), inset 0 1px 1px rgba(255,255,255,0.4) !important;
  }
  
  /* Vila: Green #2D8A6E */
  #showcase-vila {
    background: linear-gradient(135deg, rgba(45, 138, 110, 0.4) 0%, rgba(45, 138, 110, 0.1) 100%) !important;
    border: 1px solid rgba(45, 138, 110, 0.3) !important;
    box-shadow: 0 10px 40px rgba(45, 138, 110, 0.15), inset 0 1px 1px rgba(255,255,255,0.4) !important;
  }
  
  /* Lipe: Orange #C4703A */
  #showcase-lipe {
    background: linear-gradient(135deg, rgba(196, 112, 58, 0.4) 0%, rgba(196, 112, 58, 0.1) 100%) !important;
    border: 1px solid rgba(196, 112, 58, 0.3) !important;
    box-shadow: 0 10px 40px rgba(196, 112, 58, 0.15), inset 0 1px 1px rgba(255,255,255,0.4) !important;
  }
  
  /* Ararinha: Dark Green #2A7A3B */
  #showcase-ararinha {
    background: linear-gradient(135deg, rgba(42, 122, 59, 0.4) 0%, rgba(42, 122, 59, 0.1) 100%) !important;
    border: 1px solid rgba(42, 122, 59, 0.3) !important;
    box-shadow: 0 10px 40px rgba(42, 122, 59, 0.15), inset 0 1px 1px rgba(255,255,255,0.4) !important;
  }
  
  /* Colorizing the inner pills to match */
  #showcase-laura .livro-preco-item { background: rgba(123, 94, 167, 0.1) !important; border: 1px solid rgba(123, 94, 167, 0.2) !important; }
  #showcase-vila .livro-preco-item { background: rgba(45, 138, 110, 0.1) !important; border: 1px solid rgba(45, 138, 110, 0.2) !important; }
  #showcase-lipe .livro-preco-item { background: rgba(196, 112, 58, 0.1) !important; border: 1px solid rgba(196, 112, 58, 0.2) !important; }
  #showcase-ararinha .livro-preco-item { background: rgba(42, 122, 59, 0.1) !important; border: 1px solid rgba(42, 122, 59, 0.2) !important; }
</style>
`;

const oldStyle = doc.getElementById('brand-glass-cards');
if (oldStyle) oldStyle.remove();

doc.head.insertAdjacentHTML('beforeend', brandGlassCss);

fs.writeFileSync(htmlPath, dom.serialize());
console.log('Brand glass colors applied to cards!');
