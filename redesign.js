const fs = require('fs');
const { JSDOM } = require('jsdom');

// 1. Read files
const books = JSON.parse(fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\books.json', 'utf8'));
const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// 2. Add Cart Icon to Nav
const nav = doc.querySelector('.nav-container');
if (nav) {
  const cartIconHtml = `
    <div style="margin-left: auto; display: flex; align-items: center;">
      <button onclick="abrirCarrinho()" style="background: none; border: none; cursor: pointer; display: flex; align-items: center; position: relative;">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green-dark)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <span id="cart-count" style="position: absolute; top: -5px; right: -10px; background: #E53E3E; color: white; border-radius: 50%; padding: 2px 6px; font-size: 12px; font-weight: bold;">0</span>
      </button>
    </div>
  `;
  nav.insertAdjacentHTML('beforeend', cartIconHtml);
}

// 3. Add 'Adicionar ao Carrinho' to each livro-card
const cards = doc.querySelectorAll('.livro-card');
cards.forEach(card => {
  const titleEl = card.querySelector('h3');
  if (!titleEl) return;
  const title = titleEl.textContent.trim();
  
  // Find matching book in our JSON to get the ID
  const book = books.find(b => title.includes(b.title.split(' ')[0]));
  if (book) {
    const btnHtml = `
      <button onclick="adicionarAoCarrinho('${book.id}')" style="margin-top: 15px; width: 100%; background: var(--green-dark); color: white; border: none; padding: 12px; border-radius: 8px; font-size: 16px; font-weight: bold; cursor: pointer; transition: background 0.2s;" onmouseover="this.style.background='#3B432E'" onmouseout="this.style.background='var(--green-dark)'">
        🛒 Adicionar
      </button>
    `;
    card.insertAdjacentHTML('beforeend', btnHtml);
  }
});

// 4. Remove old checkout selection sections
const checkoutSection = doc.getElementById('checkout');
if (checkoutSection) {
  checkoutSection.innerHTML = `
    <div class="checkout-container" style="text-align: center; padding: 40px;">
      <h2>Finalize sua Compra</h2>
      <p>Você pode revisar seus itens clicando no carrinho de compras no topo da página.</p>
      <button onclick="abrirCarrinho()" style="background: var(--green-dark); color: white; border: none; padding: 16px 32px; border-radius: 8px; font-size: 18px; font-weight: bold; cursor: pointer; margin-top: 20px;">
        Ver Meu Carrinho 🛒
      </button>
    </div>
  `;
}

// 5. Inject Sidebar Cart HTML & CSS
const sidebarCss = `
<style>
  /* Cart Sidebar */
  .cart-sidebar {
    position: fixed; top: 0; right: -450px; width: 400px; max-width: 100%; height: 100vh;
    background: white; box-shadow: -5px 0 25px rgba(0,0,0,0.15); z-index: 10000;
    transition: right 0.3s ease; display: flex; flex-direction: column;
    font-family: 'Inter', sans-serif;
  }
  .cart-sidebar.open { right: 0; }
  .cart-header { padding: 20px; border-bottom: 1px solid #edf2f7; display: flex; justify-content: space-between; align-items: center; }
  .cart-header h2 { margin: 0; font-size: 20px; color: #2d3748; }
  .close-cart { background: none; border: none; font-size: 28px; cursor: pointer; color: #a0aec0; }
  .cart-items { flex-grow: 1; overflow-y: auto; padding: 20px; }
  .cart-item { display: flex; gap: 15px; border-bottom: 1px solid #edf2f7; padding-bottom: 15px; margin-bottom: 15px; }
  .cart-item-img { width: 60px; height: 80px; object-fit: contain; }
  .cart-item-info { flex-grow: 1; }
  .cart-item-title { font-size: 14px; font-weight: 600; margin: 0 0 5px 0; color: #2d3748; }
  .cart-item-price { font-size: 14px; color: var(--green-dark); font-weight: 700; }
  .cart-item-qty { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
  .qty-btn { background: #edf2f7; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold; color: #2d3748; }
  .remove-btn { color: #E53E3E; font-size: 12px; cursor: pointer; background: none; border: none; padding: 0; margin-left: auto; text-decoration: underline; }
  
  .cart-footer { padding: 20px; border-top: 1px solid #edf2f7; background: #f8fafc; }
  .cart-total-line { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 18px; font-weight: 800; color: #2d3748; }
  .btn-checkout { width: 100%; background: var(--green-dark); color: white; border: none; padding: 16px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer; }
  .btn-checkout:hover { background: #3B432E; }
  
  .cart-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: none; opacity: 0; transition: opacity 0.3s; }
  .cart-overlay.open { display: block; opacity: 1; }
</style>
`;
doc.head.insertAdjacentHTML('beforeend', sidebarCss);

const cartHtml = `
  <div class="cart-overlay" id="cart-overlay" onclick="fecharCarrinho()"></div>
  <div class="cart-sidebar" id="cart-sidebar">
    <div class="cart-header">
      <h2>Seu Carrinho</h2>
      <button class="close-cart" onclick="fecharCarrinho()">&times;</button>
    </div>
    <div class="cart-items" id="cart-items-container">
      <p style="text-align:center; color:#a0aec0; margin-top:40px;">Seu carrinho está vazio.</p>
    </div>
    <div class="cart-footer">
      <div class="cart-total-line">
        <span>Subtotal</span>
        <span id="cart-subtotal">R$ 0,00</span>
      </div>
      <button class="btn-checkout" onclick="irParaCheckout()">Finalizar Compra 🔒</button>
    </div>
  </div>
`;
doc.body.insertAdjacentHTML('beforeend', cartHtml);

// 6. Inject JS Logic
const scriptsHtml = `
<script>
  let carrinho = [];
  const catalogo = ${JSON.stringify(books)};

  function adicionarAoCarrinho(id) {
    const book = catalogo.find(b => b.id === id);
    if (!book) return;
    
    const exist = carrinho.find(item => item.id === id);
    if (exist) {
      exist.qtd += 1;
    } else {
      carrinho.push({ ...book, qtd: 1 });
    }
    
    atualizarCarrinhoUI();
    abrirCarrinho();
  }

  function removerDoCarrinho(id) {
    carrinho = carrinho.filter(item => item.id !== id);
    atualizarCarrinhoUI();
  }

  function alterarQtd(id, delta) {
    const item = carrinho.find(i => i.id === id);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd <= 0) removerDoCarrinho(id);
    else atualizarCarrinhoUI();
  }

  function atualizarCarrinhoUI() {
    const container = document.getElementById('cart-items-container');
    const countBadge = document.getElementById('cart-count');
    const subtotalEl = document.getElementById('cart-subtotal');
    
    let totalItens = 0;
    let subtotal = 0;
    let html = '';

    if (carrinho.length === 0) {
      html = '<p style="text-align:center; color:#a0aec0; margin-top:40px;">Seu carrinho está vazio.</p>';
    } else {
      carrinho.forEach(item => {
        totalItens += item.qtd;
        const precoNum = parseFloat(item.price);
        subtotal += precoNum * item.qtd;
        
        html += \`
          <div class="cart-item">
            <img src="\${item.image}" class="cart-item-img">
            <div class="cart-item-info">
              <h4 class="cart-item-title">\${item.title}</h4>
              <div class="cart-item-price">R$ \${item.price.toFixed(2).replace('.',',')}</div>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="alterarQtd('\${item.id}', -1)">-</button>
                <span>\${item.qtd}</span>
                <button class="qty-btn" onclick="alterarQtd('\${item.id}', 1)">+</button>
                <button class="remove-btn" onclick="removerDoCarrinho('\${item.id}')">Remover</button>
              </div>
            </div>
          </div>
        \`;
      });
    }

    container.innerHTML = html;
    if(countBadge) countBadge.textContent = totalItens;
    if(subtotalEl) subtotalEl.textContent = 'R$ ' + subtotal.toFixed(2).replace('.',',');
  }

  function abrirCarrinho() {
    document.getElementById('cart-sidebar').classList.add('open');
    document.getElementById('cart-overlay').classList.add('open');
  }

  function fecharCarrinho() {
    document.getElementById('cart-sidebar').classList.remove('open');
    document.getElementById('cart-overlay').classList.remove('open');
  }

  function irParaCheckout() {
    if (carrinho.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    // Setup for modalPagamento
    const subtotal = carrinho.reduce((acc, item) => acc + (parseFloat(item.price) * item.qtd), 0);
    window.pedidoAtual = {
      itens: carrinho.map(item => ({
        nome: item.title + (item.qtd > 1 ? ' x' + item.qtd : ''),
        preco: parseFloat(item.price) * item.qtd
      })),
      subtotal: subtotal
    };
    
    fecharCarrinho();
    
    // Fill original modal
    const resumoEl = document.getElementById('resumo-itens');
    if (resumoEl) {
      resumoEl.innerHTML = window.pedidoAtual.itens.map(i =>
        '<div class="resumo-item"><span class="resumo-item-nome">' + i.nome + '</span>' +
        '<span class="resumo-item-preco">R$ ' + i.preco.toFixed(2).replace('.',',') + '</span></div>'
      ).join('');
    }
    
    const rFrete = document.getElementById('resumo-frete-val');
    if (rFrete) rFrete.textContent = 'A calcular';
    const rTotal = document.getElementById('resumo-total-val');
    if (rTotal) rTotal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.',',');
    
    const cepRes = document.getElementById('cep-resultado');
    if(cepRes) cepRes.style.display = 'none';
    const inputCep = document.getElementById('input-cep');
    if(inputCep) inputCep.value = '';
    
    const btnBox = document.getElementById('btn-pagar-box');
    if (btnBox) btnBox.style.display = 'block';
    const brick = document.getElementById('paymentBrick_container');
    if (brick) brick.style.display = 'none';
    
    const modal = document.getElementById('modalPagamento');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
</script>
`;
doc.body.insertAdjacentHTML('beforeend', scriptsHtml);

fs.writeFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', dom.serialize());
console.log('viva_lyrio.html successfully updated with Amazon-style design!');
