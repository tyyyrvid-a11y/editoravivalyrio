const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Ensure Inter font is loaded
if (!doc.querySelector('link[href*="family=Inter"]')) {
  doc.head.insertAdjacentHTML('beforeend', '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">');
}

const appleCss = `
<style id="apple-aesthetic">
  /* Global Typography */
  :root {
    --apple-bg: #f5f5f7;
    --apple-card: #ffffff;
    --apple-text: #1d1d1f;
    --apple-text-secondary: #86868b;
    --font-inter: 'Inter', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  }
  
  body, h1, h2, h3, h4, h5, h6, p, a, button, input, textarea, span, div {
    font-family: var(--font-inter) !important;
  }
  
  body {
    background-color: var(--apple-bg) !important;
    color: var(--apple-text) !important;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  h1, h2, h3 {
    letter-spacing: -0.015em;
    font-weight: 700;
  }

  p {
    line-height: 1.5;
    letter-spacing: 0.01em;
    color: var(--apple-text-secondary);
  }

  /* Redesigning the Books Showcase (Vitrine) for Apple Aesthetic */
  .livro-showcase {
    background: var(--apple-card) !important;
    border-radius: 24px !important;
    box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;
    border: none !important;
    padding: 40px !important;
    margin-bottom: 40px !important;
    display: flex;
    gap: 40px;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  
  .livro-showcase:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.08) !important;
  }
  
  .livro-cover-wrap {
    background: #fbfbfd !important;
    border-radius: 18px !important;
    padding: 20px !important;
    border: 1px solid rgba(0,0,0,0.03);
  }
  
  .livro-title {
    font-size: 32px !important;
    color: var(--apple-text) !important;
    margin-bottom: 8px !important;
  }
  
  .livro-subtitle {
    font-size: 18px !important;
    font-weight: 500 !important;
    color: var(--apple-text-secondary) !important;
  }
  
  .preco-valor {
    font-weight: 700 !important;
    font-size: 24px !important;
    letter-spacing: -0.02em;
  }
  
  .preco-tipo {
    font-size: 14px !important;
    font-weight: 600 !important;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--apple-text-secondary);
  }
  
  .livro-preco-item {
    background: var(--apple-bg) !important;
    padding: 20px !important;
    border-radius: 16px !important;
    border: 1px solid rgba(0,0,0,0.02);
  }

  /* Updating Liquid Glass Buttons to fit Apple Aesthetic */
  .btn-liquid-glass {
    border-radius: 980px !important; /* Fully rounded like Apple buttons */
    box-shadow: 0 4px 14px rgba(0,0,0,0.1) !important;
    border: 1px solid rgba(255,255,255,0.2) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    font-weight: 600 !important;
    letter-spacing: -0.01em !important;
    padding: 12px 24px !important;
  }
  
  /* Update Navbar */
  .nav-container {
    background: rgba(255, 255, 255, 0.8) !important;
    backdrop-filter: blur(20px) saturate(180%) !important;
    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;
    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
  }
  
  .nav-brand {
    font-weight: 700 !important;
    letter-spacing: -0.02em !important;
  }
  
  /* Cart Sidebar Apple Aesthetic */
  .cart-sidebar {
    border-radius: 24px 0 0 24px !important;
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(30px) saturate(200%) !important;
    -webkit-backdrop-filter: blur(30px) saturate(200%) !important;
    box-shadow: -10px 0 40px rgba(0,0,0,0.1) !important;
  }
  
  .cart-header {
    border-bottom: 1px solid rgba(0,0,0,0.05) !important;
  }
  
  .cart-header h2 {
    font-weight: 700 !important;
  }
  
  .cart-footer {
    background: transparent !important;
    border-top: 1px solid rgba(0,0,0,0.05) !important;
  }
  
  .btn-checkout {
    border-radius: 980px !important;
    font-weight: 600 !important;
    background: var(--green-dark) !important;
    box-shadow: 0 4px 14px rgba(42, 122, 59, 0.3) !important;
  }

  /* Modals */
  .modal-content {
    border-radius: 24px !important;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15) !important;
    border: none !important;
  }
  
  /* Scrollbar Apple style */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0,0,0,0.2);
    border-radius: 10px;
  }
</style>
`;

// Remove old if exists
const oldApple = doc.getElementById('apple-aesthetic');
if (oldApple) oldApple.remove();

doc.head.insertAdjacentHTML('beforeend', appleCss);

fs.writeFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', dom.serialize());
console.log('Apple aesthetic with Inter font applied!');
