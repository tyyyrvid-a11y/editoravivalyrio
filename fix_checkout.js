const fs = require('fs');

const htmlPath = 'c:\\Users\\Artur\\Downloads\\files\\viva_lyrio.html';
let html = fs.readFileSync(htmlPath, 'utf8');

// 1. Fix the modal overflow
// Replace: style="padding:0;overflow:hidden;border-radius:16px;"
// With: style="padding:0;overflow-y:auto;overflow-x:hidden;border-radius:16px;"
html = html.replace(
  'style="padding:0;overflow:hidden;border-radius:16px;"',
  'style="padding:0;overflow-y:auto;overflow-x:hidden;border-radius:16px;"'
);

// 2. Fix the let pedidoAtual scoping issue
// We will replace `let pedidoAtual =` with `window.pedidoAtual =`
html = html.replace(
  'let pedidoAtual = { itens: [], subtotal: 0 };',
  'window.pedidoAtual = { itens: [], subtotal: 0 };'
);

// We need to replace all other occurrences of `pedidoAtual` inside the script block with `window.pedidoAtual`
// To be safe, we only replace it in calcularFrete and prepararPagamento
html = html.replace(/pedidoAtual\.subtotal/g, 'window.pedidoAtual.subtotal');
html = html.replace(/pedidoAtual\.itens/g, 'window.pedidoAtual.itens');
html = html.replace(/pedidoAtual = {/g, 'window.pedidoAtual = {');

fs.writeFileSync(htmlPath, html);
console.log('Checkout modal layout and calculation fixed!');
