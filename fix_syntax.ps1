$path = "c:\Users\Artur\Downloads\files\viva_lyrio.html"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)

$oldText = "              }`r`n            .catch(error => {"
$newText = "              }`r`n            })`r`n            .catch(error => {"
$content = $content.Replace($oldText, $newText)

# If it uses only \n instead of \r\n
$oldText2 = "              }`n            .catch(error => {"
$newText2 = "              }`n            })`n            .catch(error => {"
$content = $content.Replace($oldText2, $newText2)

[System.IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Fixed syntax error."
