$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# Find "items: items," and add the payer email after it
$pattern = '(?m)^(\s*)items:\s*items,(\s*)'
$replacement = "`$1items: items,`n`$1payer: { email: document.getElementById('email') ? document.getElementById('email').value || 'cliente@teste.com' : 'cliente@teste.com' },`$2"

$content = $content -replace $pattern, $replacement
[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Payer email injected successfully!"
