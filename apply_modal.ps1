$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Find the start of the modal and replace it
$pattern = '(?s)<!-- MODAL PAGAMENTO \(mock Mercado Pago\) -->.*?</div>\s*</div>\s*</div>'

$replacement = @"
<!-- MODAL CARRINHO DE COMPRAS -->
<div class="modal-overlay" id="modalPagamento">
  <div class="modal-box" id="modalBox" style="padding:0;overflow:hidden;border-radius:16px;">

    <!-- Header -->
    <div style="background:var(--green-dark);color:white;padding:20px;display:flex;justify-content:space-between;align-items:center;">
      <h3 style="margin:0;font-size:18px;font-family:Inter,sans-serif;">Resumo do Pedido</h3>
      <button class="modal-close" style="position:static;color:white;" onclick="fecharModal()">×</button>
    </div>

    <div style="padding:24px;">
      <!-- Resumo dos Itens -->
      <div id="resumo-itens" style="margin-bottom:15px;"></div>
      
      <!-- Linha do Frete -->
      <div class="resumo-frete" style="display:flex;justify-content:space-between;border-bottom:1px solid #EEE;padding-bottom:15px;margin-bottom:15px;">
        <span>Frete (PAC/Sedex)</span>
        <span id="resumo-frete-val" style="font-weight:600;">A calcular</span>
      </div>

      <!-- Total -->
      <div class="resumo-total" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
        <span style="font-size:16px;color:#666;">Total</span>
        <span class="resumo-total-valor" id="resumo-total-val" style="font-size:24px;color:var(--green-dark);font-weight:800;">R$ 0,00</span>
      </div>

      <!-- Calculadora de CEP -->
      <label style="font-size:12px;text-transform:uppercase;letter-spacing:0.05em;color:#888;font-weight:700;margin-bottom:8px;display:block;">Calcular Frete</label>
      <div style="display:flex;gap:10px;margin-bottom:15px;">
        <input id="input-cep" placeholder="00000-000" maxlength="9"
          style="flex:1;padding:12px 16px;border:1px solid #DDD;border-radius:10px;font-size:15px;font-family:Inter,sans-serif;outline:none;"
          oninput="formatarCEP(this)"
          onkeypress="if(event.key==='Enter') calcularFrete()">
        <button onclick="calcularFrete()" style="background:#E8F0EA;color:var(--green-dark);border:none;border-radius:10px;padding:0 20px;font-weight:700;cursor:pointer;transition:background 0.2s;">OK</button>
      </div>
      <div id="cep-resultado" style="display:none;font-size:13px;color:#555;background:#F5F5F5;border-radius:10px;padding:12px;margin-bottom:24px;line-height:1.5;"></div>

      <!-- Botão de Pagamento -->
      <button class="btn-pagar" style="width:100%;padding:16px;background:var(--green-dark);color:white;border:none;border-radius:12px;font-size:16px;font-weight:700;cursor:pointer;display:flex;justify-content:center;align-items:center;gap:8px;transition:background 0.2s;" onmouseover="this.style.background='#3B432E'" onmouseout="this.style.background='var(--green-dark)'" onclick="simularPagamento()">
        Ir para Pagamento Seguro ??
      </button>
    </div>
  </div>
</div>
"@

$content = $content -replace $pattern, $replacement
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Modal replaced!"
