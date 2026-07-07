const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// 1. Add the Global CSS for Liquid Glass
const glassCss = `
<style id="liquid-glass-styles">
  .btn-liquid-glass {
    position: relative;
    padding: 14px 24px;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    color: white;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    overflow: hidden;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
  }
  
  .btn-liquid-glass::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: linear-gradient(180deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 100%);
    opacity: 0.5;
    transition: opacity 0.3s;
  }
  
  .btn-liquid-glass:hover {
    transform: translateY(-3px) scale(1.02);
  }
  
  .btn-liquid-glass:hover::before {
    opacity: 0.8;
  }

  .btn-liquid-glass:active {
    transform: translateY(1px) scale(0.98);
  }
</style>
`;
if (!doc.getElementById('liquid-glass-styles')) {
  doc.head.insertAdjacentHTML('beforeend', glassCss);
}

// Map the colors used in the layout
const colorMap = {
  'qtd-laura-flex': '123, 94, 167', // #7B5EA7
  'qtd-laura-dura': '123, 94, 167',
  'qtd-vila-flex': '45, 138, 110', // #2D8A6E
  'qtd-vila-dura': '45, 138, 110',
  'qtd-lipe': '196, 112, 58', // #C4703A
  'qtd-ararinha': '42, 122, 59' // #2A7A3B
};

// 2. Update the buttons
const btns = doc.querySelectorAll('.btn-cart-container button');
btns.forEach(btn => {
  // Clear old inline style
  btn.style.cssText = '';
  btn.className = 'btn-liquid-glass';
  btn.onmouseover = null;
  btn.onmouseout = null;
  btn.removeAttribute('onmouseover');
  btn.removeAttribute('onmouseout');
  
  // Extract ID to find base color
  const onclickStr = btn.getAttribute('onclick') || '';
  const match = onclickStr.match(/'([^']+)'/);
  const id = match ? match[1] : '';
  const rgb = colorMap[id] || '45, 138, 110'; // default green

  btn.style.background = `rgba(${rgb}, 0.75)`;
  btn.style.boxShadow = `0 8px 32px 0 rgba(${rgb}, 0.3), inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)`;
});

fs.writeFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', dom.serialize());
console.log('Liquid glass applied!');
