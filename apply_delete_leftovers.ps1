$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$lines = [System.IO.File]::ReadAllLines($path, [System.Text.Encoding]::UTF8)

# Calculate indices to remove (lines 4526 to 4571 are index 4525 to 4570)
# But let's find the exact indices by looking for the content to be safe.
$startIndex = -1
$endIndex = -1

for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '<label class="mp-field-label">Número do cartão</label>') {
        $startIndex = $i - 1 # Include the </div></div> just before it
    }
    if ($startIndex -ne -1 -and $lines[$i] -match '?? Pagamento seguro · SSL 256-bit · Mercado Pago') {
        $endIndex = $i + 2 # Include the closing divs
        break
    }
}

if ($startIndex -ne -1 -and $endIndex -ne -1) {
    $newLines = $lines[0..($startIndex - 1)] + $lines[($endIndex + 1)..($lines.Count - 1)]
    [System.IO.File]::WriteAllLines($path, $newLines, (New-Object System.Text.UTF8Encoding $false))
    Write-Host "Leftover mock UI deleted successfully! Removed from index $startIndex to $endIndex."
} else {
    Write-Host "Could not find the target block."
}
