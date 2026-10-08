$source = "D:\DockerWSL\disk\docker_data.vhdx"
$target = "$env:LOCALAPPDATA\Docker\wsl\disk\docker_data.vhdx"

Write-Host "Restoring VHDX..."
Move-Item -Path $source -Destination $target -Force

Write-Host "Updating JSON..."
$jsonPath = "$env:APPDATA\Docker\settings-store.json"
$json = Get-Content $jsonPath | ConvertFrom-Json
$json.PSObject.Properties.Remove("dataFolder")
$json.PSObject.Properties.Remove("DataFolder")
$json | ConvertTo-Json -Depth 10 | Set-Content $jsonPath

Write-Host "Updating Registry..."
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Lxss\{5c731285-afd5-4587-86bc-830b91e2d8bc}" -Name "BasePath" -Value "\\?\C:\Users\PC1\AppData\Local\Docker\wsl\main"

Write-Host "Cleaning up D drive..."
Remove-Item -Path "D:\DockerWSL" -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "Done! Starting Docker Desktop..."
Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
