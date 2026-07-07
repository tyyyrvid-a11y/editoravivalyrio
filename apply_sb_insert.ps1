$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$target = @"
    try {
      const res = await fetch('https://api.mercadopago.com/checkout/preferences'
"@

$replacement = @"
    // ===== SALVAR PEDIDO NO SUPABASE =====
    try {
      const pedidoParaSalvar = {
        detalhes: {
          itens: items,
          total: totalVal,
          cliente: {
            cep: document.getElementById('input-cep') ? document.getElementById('input-cep').value : 'Não informado'
          }
        },
        status: 'pendente'
      };
      
      const sbUrl = 'https://adacpnvxwvtmxcrgpucd.supabase.co/rest/v1/pedidos';
      const sbKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkYWNwbnZ4d3Z0bXhjcmdwdWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzNDA0NDgsImV4cCI6MjA5NzkxNjQ0OH0.rlTQtT_YO5OTfiDIuC2TYnN07rwZe_trZZtbGjQg1bU';
      
      await fetch(sbUrl, {
        method: 'POST',
        headers: {
          'apikey': sbKey,
          'Authorization': 'Bearer ' + sbKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify(pedidoParaSalvar)
      });
    } catch (e) {
      console.error('Erro ao salvar no Supabase:', e);
    }
    // =====================================

    try {
      const res = await fetch('https://api.mercadopago.com/checkout/preferences'
"@

$content = $content.Replace($target, $replacement)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Supabase insert injected!"
