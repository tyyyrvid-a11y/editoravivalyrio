$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$target = @"
        body: JSON.stringify({
          items: items,
          back_urls: {
"@

$replacement = @"
        body: JSON.stringify({
          items: items,
          payer: {
            email: document.getElementById('email') ? document.getElementById('email').value || 'cliente@teste.com' : 'cliente@teste.com'
          },
          back_urls: {
"@

$content = $content.Replace($target, $replacement)
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Payer email added to Mercado Pago payload!"
