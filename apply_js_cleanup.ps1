$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

# 1. Remove Parcelas logic from abrirModal()
$pattern1 = '(?s)\s*// Parcelas no cartão.*?setMetodo\(''pix''\);.*?\n\s*document.getElementById\(''painel-sucesso''\).classList.remove\(''active''\);'
$replacement1 = ""
$content = $content -replace $pattern1, $replacement1

# 2. Remove setMetodo function completely
$pattern2 = '(?s)\s*function setMetodo\(m\) \{.*?\n\s*\}'
$replacement2 = ""
$content = $content -replace $pattern2, $replacement2

# 3. Remove parcelas logic from calcularFrete()
$pattern3 = '(?s)\s*// Atualizar parcelas.*?sel.appendChild\(op\);\s*\}'
$replacement3 = ""
$content = $content -replace $pattern3, $replacement3

# 4. Remove fake card/pix formatting functions
$pattern4 = '(?s)\s*function formatarCartao\(el\).*?function copiarPix\(\) \{.*?\n\s*\}\s*\}\s*'
# Actually it's safer to just do simple string replacements for the start/end if regex is tricky, but let's try a regex for formatarCartao up to the end of copiarPix
$pattern4b = '(?s)\s*function formatarCartao\(el\).*?function copiarPix\(\) \{.*?\n\s*\}\s*\n'
$content = $content -replace $pattern4b, "`n"

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "JS Cleanup complete."
