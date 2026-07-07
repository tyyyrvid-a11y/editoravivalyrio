$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$oldPreparar = '(?s)async function prepararPagamento\(\) \{.*?renderPaymentBrick\(totalTestAmount, items\);\s*\}'
$newPreparar = @"
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
    
    const btnBox = document.getElementById('btn-pagar-box');
    if (btnBox) btnBox.style.display = 'none'; 
    
    document.getElementById('paymentBrick_container').style.display = 'block';
    renderPaymentBrick(totalVal, items);
  }
"@

$content = $content -replace $oldPreparar, $newPreparar

# In the renderPaymentBrick onSubmit, if it's Pix, we should show the QR Code in an alert or handle it.
# Let's see if we can update the success handling.
$oldResolve = '(?s)resolve\(\);\s*if \(data\.status ===.*?\}\)'
$newResolve = @"
              resolve();
              if (data.status === 'approved') {
                document.getElementById('painel-sucesso').classList.add('active');
              } else if (data.status === 'pending' || data.status === 'in_process') {
                // If Pix or Boleto, we get instructions
                if (data.point_of_interaction && data.point_of_interaction.transaction_data && data.point_of_interaction.transaction_data.qr_code) {
                   const pixCopiaECola = data.point_of_interaction.transaction_data.qr_code;
                   alert('Pedido gerado! Pague via PIX Copia e Cola:\n\n' + pixCopiaECola);
                   document.getElementById('painel-sucesso').classList.add('active');
                } else if (data.transaction_details && data.transaction_details.external_resource_url) {
                   // Boleto
                   window.open(data.transaction_details.external_resource_url, '_blank');
                   document.getElementById('painel-sucesso').classList.add('active');
                } else {
                   document.getElementById('painel-sucesso').classList.add('active');
                }
              } else {
                alert('Erro no pagamento: ' + (data.message || data.status_detail || 'Pagamento recusado'));
              }
"@

$content = $content -replace $oldResolve, $newResolve

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Fixed 1 cent issue and QR code handling."
