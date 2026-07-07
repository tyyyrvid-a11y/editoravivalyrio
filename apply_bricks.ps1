$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Add MercadoPago SDK in the <head>
if (-not $content.Contains('sdk.mercadopago.com/js/v2')) {
    $headEnd = '</head>'
    $sdkScript = "<script src=`"https://sdk.mercadopago.com/js/v2`"></script>`n</head>"
    $content = $content -replace '</head>', $sdkScript
}

# 2. Replace simularPagamento and the checkout logic with Payment Bricks logic
$oldSimular = '(?s)async function simularPagamento\(\) \{.*?(?=// ===== TIPO DE COMPRA =====)'
$newSimular = @"
  let cardPaymentBrickController;
  
  async function renderPaymentBrick(totalAmount, items) {
    const mp = new MercadoPago('APP_USR-cc360ab6-560c-47b8-b41c-e40eb37a3d0d', { locale: 'pt-BR' });
    const bricksBuilder = mp.bricks();
    
    const settings = {
      initialization: {
        amount: totalAmount, // The total amount
        preferenceId: null, // Not needed if we pass amount
      },
      customization: {
        visual: { style: { theme: 'default' } },
        paymentMethods: {
          pix: 'all',
          creditCard: 'all',
          debitCard: 'all',
          ticket: 'all'
        }
      },
      callbacks: {
        onReady: () => {
          // Brick is ready
        },
        onSubmit: ({ selectedPaymentMethod, formData }) => {
          return new Promise((resolve, reject) => {
            // Append items and total to the payload for our backend
            formData.items = items;
            formData.total = totalAmount;
            
            fetch('http://localhost:3000/process_payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(formData)
            })
            .then(res => res.json())
            .then(data => {
              resolve();
              if (data.status === 'approved' || data.status === 'pending' || data.status === 'in_process') {
                document.getElementById('painel-sucesso').classList.add('active');
              } else {
                alert('Erro no pagamento: ' + (data.message || data.status_detail || 'Pagamento recusado'));
              }
            })
            .catch(error => {
              reject();
              alert('Erro de conexão ao processar pagamento.');
            });
          });
        },
        onError: (error) => {
          console.error(error);
        }
      }
    };
    
    if (cardPaymentBrickController) cardPaymentBrickController.unmount();
    window.cardPaymentBrickController = await bricksBuilder.create('payment', 'paymentBrick_container', settings);
  }

  async function prepararPagamento() {
    const totalText = document.getElementById('resumo-total-val').textContent;
    if (totalText === 'A calcular' || !document.getElementById('input-cep').value) {
      alert('Por favor, calcule o frete antes de prosseguir.');
      return;
    }
    const totalVal = parseFloat(totalText.replace('R$ ', '').replace('.', '').replace(',', '.'));
    
    const items = pedidoAtual.itens.map(i => ({
      title: i.nome,
      quantity: 1,
      unit_price: i.preco
    }));
    const frete = totalVal - pedidoAtual.subtotal;
    if (frete > 0.01) {
      items.push({ title: 'Frete', quantity: 1, unit_price: Number(frete.toFixed(2)) });
    }
    
    // Test mode 1 cent
    items.forEach(i => { i.title = '[TESTE] ' + i.title; i.unit_price = 0.01; });
    const totalTestAmount = items.length * 0.01; // E.g., 2 items = R$ 0.02
    
    const btnBox = document.getElementById('btn-pagar-box');
    if (btnBox) btnBox.style.display = 'none'; // hide the regular pay button
    
    document.getElementById('paymentBrick_container').style.display = 'block';
    renderPaymentBrick(totalTestAmount, items);
  }

"@
$content = $content -replace $oldSimular, $newSimular

# 3. Replace the old "Ir para Pagamento Seguro" button with the Brick container
# In viva_lyrio.html, we have:
# <div id="btn-pagar-box">
#   <button class="btn-pagar" onclick="prepararPagamento()">
$oldButtonHTML = '(?s)<!-- Botão de Pagamento -->.*?Ir para Pagamento Seguro \?\?.*?<\/button>'
$newButtonHTML = @"
      <!-- Botão de Pagamento -->
      <div id="btn-pagar-box">
        <button class="btn-pagar" style="width:100%;padding:16px;background:var(--green-dark);color:white;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:8px;transition:background 0.2s;" onmouseover="this.style.background='#3B432E'" onmouseout="this.style.background='var(--green-dark)'" onclick="prepararPagamento()">
          ?? Ir para Pagamento Seguro
        </button>
      </div>
      <!-- Brick do Mercado Pago -->
      <div id="paymentBrick_container" style="display:none; margin-top:20px;"></div>
"@
$content = $content -replace $oldButtonHTML, $newButtonHTML

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Payment Bricks integrated!"
