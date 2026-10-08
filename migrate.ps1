Stop-Process -Name "*Docker*" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "com.docker.backend" -Force -ErrorAction SilentlyContinue
Stop-Process -Name "vpnkit" -Force -ErrorAction SilentlyContinue

Write-Host "Shutting down WSL..."
wsl --shutdown
Start-Sleep -Seconds 5

$source = "$env:LOCALAPPDATA\Docker\wsl"
$destinationParent = "D:\DockerWSL"
$destination = "D:\DockerWSL\wsl"

if (Test-Path $source) {
    Write-Host "Moving $source to $destinationParent..."
    Move-Item -Path $source -Destination $destinationParent -Force
    Start-Sleep -Seconds 5

    Write-Host "Creating junction link..."
    cmd /c mklink /J "$source" "$destination"

    Write-Host "Starting Docker Desktop..."
    Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
} else {
    Write-Host "Source path not found!"
}
