const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// 1. Add background orbs for the glass effect to be visible
const bgHtml = `
  <div class="glass-bg-blobs">
    <div class="blob blob-purple"></div>
    <div class="blob blob-green"></div>
    <div class="blob blob-orange"></div>
  </div>
`;
if (!doc.querySelector('.glass-bg-blobs')) {
  doc.body.insertAdjacentHTML('afterbegin', bgHtml);
}

// 2. Add the CSS for cards and background
const glassCardCss = `
<style id="liquid-glass-cards">
  /* Background Blobs */
  body {
    background-color: #f5f5f7 !important;
    position: relative;
    overflow-x: hidden;
  }
  
  .glass-bg-blobs {
    position: fixed;
    top: 0; left: 0; width: 100vw; height: 100vh;
    z-index: -1;
    overflow: hidden;
    pointer-events: none;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  }
  
  .blob {
    position: absolute;
    filter: blur(80px);
    opacity: 0.6;
    border-radius: 50%;
    animation: float 20s infinite ease-in-out alternate;
  }
  
  .blob-purple {
    width: 600px; height: 600px;
    background: rgba(123, 94, 167, 0.4);
    top: -100px; left: -100px;
  }
  
  .blob-green {
    width: 500px; height: 500px;
    background: rgba(45, 138, 110, 0.4);
    bottom: -100px; right: 10%;
    animation-delay: -5s;
  }
  
  .blob-orange {
    width: 400px; height: 400px;
    background: rgba(196, 112, 58, 0.3);
    top: 40%; left: 30%;
    animation-delay: -10s;
  }
  
  @keyframes float {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(50px, 50px) scale(1.1); }
  }

  /* Liquid Glass Cards */
  .livro-showcase {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.3) 100%) !important;
    backdrop-filter: blur(20px) saturate(160%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(160%) !important;
    border-radius: 30px !important;
    box-shadow: 
      0 10px 40px rgba(0,0,0,0.05),
      inset 0 1px 1px rgba(255,255,255,0.8),
      inset 0 -1px 2px rgba(255,255,255,0.3) !important;
    border: 1px solid rgba(255, 255, 255, 0.5) !important;
    position: relative;
    z-index: 1;
  }
  
  .livro-cover-wrap {
    background: rgba(255,255,255, 0.4) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255,255,255,0.6) !important;
    box-shadow: inset 0 2px 4px rgba(255,255,255,0.8) !important;
  }
  
  /* Make price pills slightly glassy too */
  .livro-preco-item {
    background: rgba(255, 255, 255, 0.5) !important;
    backdrop-filter: blur(10px) !important;
    border: 1px solid rgba(255, 255, 255, 0.6) !important;
    box-shadow: inset 0 1px 2px rgba(255,255,255,0.8) !important;
  }
</style>
`;

const oldGlass = doc.getElementById('liquid-glass-cards');
if (oldGlass) oldGlass.remove();

doc.head.insertAdjacentHTML('beforeend', glassCardCss);

fs.writeFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', dom.serialize());
console.log('Liquid glass cards applied!');
