const fs = require('fs');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', 'utf8');
const dom = new JSDOM(html);
const doc = dom.window.document;

// Use .livro-showcase!
const books = doc.querySelectorAll('.livro-showcase');
books.forEach(book => {
  const titleEl = book.querySelector('.livro-title');
  if (!titleEl) return;
  const title = titleEl.textContent;

  // We want to replace the .livro-cta with our Add buttons
  const cta = book.querySelector('.livro-cta');
  if (cta) {
    cta.style.display = 'none'; // hide the old "Comprar agora" button
  }

  const precoContainer = book.querySelector('.livro-precos');
  if (!precoContainer) return;
  
  // If we already added a button-container, don't do it again
  if (book.querySelector('.btn-cart-container')) return;

  const btnContainer = doc.createElement('div');
  btnContainer.className = 'btn-cart-container';
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '10px';
  btnContainer.style.marginTop = '20px';

  const precoItems = book.querySelectorAll('.livro-preco-item');
  precoItems.forEach(precoItem => {
    const tipoEl = precoItem.querySelector('.preco-tipo');
    let tipo = tipoEl ? tipoEl.textContent : '';
    let id = '';

    if (title.includes('Laura')) {
      id = tipo.includes('Dura') ? 'qtd-laura-dura' : 'qtd-laura-flex';
    } else if (title.includes('Vila')) {
      id = tipo.includes('Dura') ? 'qtd-vila-dura' : 'qtd-vila-flex';
    } else if (title.includes('Lipe')) {
      id = 'qtd-lipe';
    } else if (title.includes('Ararinha')) {
      id = 'qtd-ararinha';
    }

    if (id) {
      const btn = doc.createElement('button');
      btn.innerHTML = `🛒 Adicionar ${tipo}`;
      // Extract color from the CTA if possible, or use a default
      const color = cta ? cta.style.background : 'var(--green-dark)';
      btn.style.cssText = `background: ${color}; color: white; border: none; padding: 12px 20px; border-radius: 30px; font-size: 16px; font-weight: bold; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 6px rgba(0,0,0,0.1);`;
      btn.setAttribute('onclick', `adicionarAoCarrinho('${id}')`);
      btn.onmouseover = function() { this.style.transform='scale(1.05)' };
      btn.onmouseout = function() { this.style.transform='scale(1)' };
      
      btnContainer.appendChild(btn);
    }
  });

  // Insert the buttons right after the precoContainer
  precoContainer.parentNode.insertBefore(btnContainer, precoContainer.nextSibling);
});

fs.writeFileSync('c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html', dom.serialize());
console.log('Buttons correctly injected inside .livro-showcase!');
