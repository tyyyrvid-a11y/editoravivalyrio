$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)

$startIndex = -1
$endIndex = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i].Contains('<label class="mp-field-label">Número do cartão</label>')) {
        $startIndex = $i - 1 
    }
    if ($startIndex -ne -1 -and $lines[$i].Contains('Pagamento seguro') -and $lines[$i].Contains('Mercado Pago')) {
        $endIndex = $i + 2
        break
    }
}

if ($startIndex -ne -1 -and $endIndex -ne -1) {
    $newLines = $lines[0..($startIndex - 1)] + $lines[($endIndex + 1)..($lines.Count - 1)]
    [System.IO.File]::WriteAllLines($path, $newLines, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Leftover mock UI deleted successfully! Removed from index $startIndex to $endIndex."
} else {
    Write-Host "Could not find the target block. Start: $startIndex, End: $endIndex"
}
