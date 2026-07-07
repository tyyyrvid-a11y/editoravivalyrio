$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Fix calcularFrete
$oldFrete = '(?s)function calcularFrete\(\) \{.*?\}, 1200\);\s*\}'
$newFrete = @"
  async function calcularFrete() {
    const cep = document.getElementById('input-cep').value.replace(/\D/g,'');
    if (cep.length !== 8) { alert('Digite um CEP válido com 8 dígitos.'); return; }

    const el = document.getElementById('cep-resultado');
    el.style.display = 'block';
    el.innerHTML = '? Calculando frete...';

    try {
      const res = await fetch('https://viacep.com.br/ws/' + cep + '/json/');
      const data = await res.json();
      if (data.erro) throw new Error('CEP não encontrado');
      
      const pac = 15.80; 
      const sedex = 28.40; 
      const frete = pac;

      el.innerHTML = '?? ' + data.localidade + ', ' + data.uf + '<br><strong>PAC:</strong> R$ 15,80 (5-8 dias úteis) &nbsp;|&nbsp; <strong>SEDEX:</strong> R$ 28,40 (1-3 dias úteis)';
        
      document.getElementById('resumo-frete-val').textContent = 'R$ 15,80';
      const total = pedidoAtual.subtotal + frete;
      document.getElementById('resumo-total-val').textContent = 'R$ ' + total.toFixed(2).replace('.',',');
    } catch(e) {
      el.innerHTML = '? CEP não encontrado. Verifique o número e tente novamente.';
    }
  }
"@

$content = $content -replace $oldFrete, $newFrete

# 2. Fix simularPagamento
$oldSimular = '(?s)async function simularPagamento\(\) \{.*?(?=// ===== TIPO DE COMPRA =====)'
$newSimular = @"
  async function simularPagamento() {
    const btns = document.querySelectorAll('.btn-pagar');
    btns.forEach(b => { b.disabled = true; b.textContent = '? Redirecionando...'; });

    try {
      const totalText = document.getElementById('resumo-total-val').textContent;
      const totalVal = parseFloat(totalText.replace('R$ ', '').replace('.', '').replace(',', '.'));
      const token = 'APP_USR-6446017048803963-062716-a26b48aa8dbec68667ff8b407afecf42-3502535372';
      
      const items = pedidoAtual.itens.map(i => ({
        title: '[TESTE] ' + i.nome,
        quantity: 1,
        unit_price: 0.01
      }));
      
      const frete = totalVal - pedidoAtual.subtotal;
      if (frete > 0.01) {
        items.push({
          title: '[TESTE] Frete',
          quantity: 1,
          unit_price: 0.01
        });
      }

      const emailInput = document.getElementById('email');
      const payerEmail = (emailInput && emailInput.value.trim() !== '') ? emailInput.value.trim() : 'cliente@teste.com';

      const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items,
          payer: { email: payerEmail },
          back_urls: {
            success: window.location.href,
            failure: window.location.href,
            pending: window.location.href
          },
          auto_return: "approved"
        })
      });
      
      const data = await res.json();
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro do Mercado Pago: ' + (data.message || 'Erro desconhecido'));
        btns.forEach(b => { b.disabled = false; b.textContent = '?? Pagar agora'; });
      }
    } catch(e) {
      alert('Erro inesperado: ' + e.message);
      console.error(e);
      btns.forEach(b => { b.disabled = false; b.textContent = '?? Pagar agora'; });
    }
  }

"@

$content = $content -replace $oldSimular, $newSimular
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Replaced calcularFrete and simularPagamento successfully!"
