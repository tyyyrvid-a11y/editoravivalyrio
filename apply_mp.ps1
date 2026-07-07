$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$pattern = '(?s)function simularPagamento\(\) \{.*?\}(?=\s*// ===== TIPO DE COMPRA =====)'

$replacement = @"
async function simularPagamento() {
    /* 
      ===============================================================
      ALERTA DE SEGURANÇA (IMPORTANTE!):
      ===============================================================
      Colocar o Access Token diretamente no HTML (frontend) é uma 
      falha de segurança grave em produção. Qualquer pessoa pode 
      roubar esse token abrindo o código-fonte e ter acesso à sua 
      conta do Mercado Pago.
      
      Esta integração foi feita diretamente no HTML para ser rápida e
      fácil conforme solicitado, mas para um ambiente de vendas 
      reais, recomendo fortemente mover isso para o seu servidor 
      (backend/Supabase).
      ===============================================================
    */

    const btns = document.querySelectorAll('.btn-pagar');
    btns.forEach(b => { b.disabled = true; b.textContent = '? Redirecionando...'; });

    const totalText = document.getElementById('resumo-total-val').textContent;
    const totalVal = parseFloat(totalText.replace('R$ ', '').replace('.', '').replace(',', '.'));

    const token = 'APP_USR-6446017048803963-062716-a26b48aa8dbec68667ff8b407afecf42-3502535372';
    
    const items = pedidoAtual.itens.map(i => ({
      title: i.nome,
      quantity: 1,
      unit_price: i.preco
    }));
    
    const frete = totalVal - pedidoAtual.subtotal;
    if (frete > 0.01) {
      items.push({
        title: 'Frete (PAC/Sedex)',
        quantity: 1,
        unit_price: Number(frete.toFixed(2))
      });
    }

    try {
      const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: items,
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
        alert('Erro ao gerar pagamento: ' + (data.message || 'Verifique as credenciais'));
        btns.forEach(b => { b.disabled = false; b.textContent = 'Pagar agora'; });
      }
    } catch(e) {
      alert('Erro de conexão com o Mercado Pago.');
      btns.forEach(b => { b.disabled = false; b.textContent = 'Pagar agora'; });
    }
  }
"@

$content = $content -replace $pattern, $replacement
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Replacement done."
