const fs = require('fs');
const path = 'c:\\Users\\Artur\\Downloads\\files\\index.html';
let html = fs.readFileSync(path, 'utf8');

// 1. Inject painel-sucesso HTML
const targetHTML = `<div id="paymentBrick_container"></div>`;
const successHTML = `<div id="paymentBrick_container"></div>

        <div class="painel-sucesso" id="painel-sucesso">
          <div class="sucesso-icon">✓</div>
          <h3 class="sucesso-titulo">Pedido Realizado!</h3>
          <p style="color:var(--text-muted);margin-bottom:20px;">Falta pouco para finalizar.</p>
          <div id="pix-container" style="display:none;background:#f5f5f7;padding:16px;border-radius:12px;margin-bottom:20px;">
            <p style="font-weight:600;margin-bottom:8px;">Pague com PIX Copia e Cola:</p>
            <textarea id="pix-code" readonly style="width:100%;height:80px;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:12px;font-family:monospace;resize:none;margin-bottom:12px;"></textarea>
            <button class="btn-liquid-glass" style="width:100%;justify-content:center;background:rgba(42,122,59,0.8);" onclick="copiarPix()">Copiar Código PIX</button>
          </div>
          <button class="btn-secondary" onclick="window.location.reload()" style="width:100%;justify-content:center;">Fechar e Voltar à Loja</button>
        </div>`;

if (!html.includes('id="pix-container"')) {
    html = html.replace(targetHTML, successHTML);
}

// 2. Add copiarPix function
if (!html.includes('function copiarPix()')) {
    html = html.replace('</body>', `
<script>
function copiarPix() {
  const pixCode = document.getElementById('pix-code');
  pixCode.select();
  document.execCommand('copy');
  alert('Código PIX copiado!');
}
</script>
</body>`);
}

// 3. Fix JS resolve and alert
const oldJS = `alert('Pedido gerado! Pague via PIX Copia e Cola:\\n\\n' + pixCopiaECola);
                   document.getElementById('painel-sucesso').classList.add('active');`;
const newJS = `resolve();
                   document.getElementById('pix-code').value = pixCopiaECola;
                   document.getElementById('pix-container').style.display = 'block';
                   document.getElementById('btn-pagar-box').style.display = 'none';
                   document.getElementById('paymentBrick_container').style.display = 'none';
                   document.getElementById('painel-sucesso').classList.add('active');`;
html = html.replace(oldJS, newJS);

// Also add resolve() to the Boleto block and approved block if missing
html = html.replace(
  `window.open(data.transaction_details.external_resource_url, '_blank');
                   document.getElementById('painel-sucesso').classList.add('active');`,
  `resolve();
                   window.open(data.transaction_details.external_resource_url, '_blank');
                   document.getElementById('btn-pagar-box').style.display = 'none';
                   document.getElementById('paymentBrick_container').style.display = 'none';
                   document.getElementById('painel-sucesso').classList.add('active');`
);

// 4. Mobile Catalog CSS Fixes
const oldCSS1 = `.livro-cover img {
    width: 260px;`;
const newCSS1 = `.livro-cover img {
    width: 100%; max-width: 260px;`;
html = html.replace(oldCSS1, newCSS1);

if (!html.includes('/* Mobile Catalog Fixes */')) {
    const mobileFixes = `
  /* Mobile Catalog Fixes */
  @media (max-width: 768px) {
    .btn-cart-container { flex-direction: column !important; }
    .btn-liquid-glass { width: 100% !important; justify-content: center !important; }
    .livro-showcase { margin-bottom: 40px !important; }
    .livro-cover-wrap { padding: 20px 10px !important; }
    .livro-info { padding: 0 10px 40px 10px !important; }
    .reverse .livro-info { padding: 0 10px 40px 10px !important; }
  }
</style>`;
    html = html.replace('</style>', mobileFixes);
}

fs.writeFileSync(path, html, 'utf8');
console.log('fix_all done');
