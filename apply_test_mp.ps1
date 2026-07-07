$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$target = @"
    try {
      const res = await fetch('https://api.mercadopago.com/checkout/preferences'
"@

$replacement = @"
    // ===== MODO DE TESTE (1 CENTAVO) =====
    items.forEach(i => {
      i.title = '[TESTE] ' + i.title;
      i.unit_price = 0.01; 
    });
    // =======================================

    try {
      const res = await fetch('https://api.mercadopago.com/checkout/preferences'
"@

$content = $content.Replace($target, $replacement)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Modo de teste aplicado!"
