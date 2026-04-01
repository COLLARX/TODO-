param(
  [switch]$SkipFrontendInstall
)

$ErrorActionPreference = "Stop"
if (Get-Variable -Name PSNativeCommandUseErrorActionPreference -ErrorAction SilentlyContinue) {
  $PSNativeCommandUseErrorActionPreference = $true
}

function Write-Step([string]$message) {
  Write-Host "`n==> $message" -ForegroundColor Cyan
}

function Assert-Command([string]$name) {
  if (-not (Get-Command $name -ErrorAction SilentlyContinue)) {
    throw "Missing required command: $name"
  }
}

function Invoke-Checked([scriptblock]$CommandBlock, [string]$FailureMessage) {
  & $CommandBlock
  if ($LASTEXITCODE -ne 0) {
    throw $FailureMessage
  }
}

function Test-HttpOk([string]$url) {
  try {
    $resp = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2
    return $resp.StatusCode -eq 200
  }
  catch {
    return $false
  }
}

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot "frontend"
$backendDir = Join-Path $repoRoot "backend"

if (-not (Test-Path $frontendDir)) { throw "Frontend directory not found: $frontendDir" }
if (-not (Test-Path $backendDir)) { throw "Backend directory not found: $backendDir" }

Write-Step "Checking required commands"
Assert-Command "node"
Assert-Command "npm"
Assert-Command "java"
Assert-Command "mvn"

if (-not $SkipFrontendInstall) {
  Write-Step "Installing frontend dependencies (npm install)"
  Push-Location $frontendDir
  try {
    Invoke-Checked { npm install } "Frontend dependency install failed."
  }
  finally {
    Pop-Location
  }
}

Write-Step "Starting backend (Spring Boot)"
$backendCmd = "Set-Location '$backendDir'; mvn spring-boot:run"
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null

Write-Step "Starting frontend (Vite)"
$frontendCmd = "Set-Location '$frontendDir'; npm run dev"
$frontendProc = Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -PassThru

Write-Step "Verifying frontend endpoint"
$viteOk = $false
$indexOk = $false
for ($i = 0; $i -lt 20; $i++) {
  Start-Sleep -Milliseconds 500
  if (Test-HttpOk "http://127.0.0.1:5173/@vite/client") {
    $viteOk = $true
  }
  if (Test-HttpOk "http://127.0.0.1:5173/") {
    $indexOk = $true
  }
  if ($viteOk -and $indexOk) {
    break
  }
}
if (-not ($viteOk -and $indexOk)) {
  try { Stop-Process -Id $frontendProc.Id -Force -ErrorAction SilentlyContinue } catch {}
  throw "Frontend started but 127.0.0.1:5173 is not serving Vite index correctly. Please close any old process occupying port 5173 and retry."
}

Write-Host ""
Write-Host "Started." -ForegroundColor Green
Write-Host "Frontend: http://127.0.0.1:5173"
Write-Host "Backend:  http://127.0.0.1:8080"
Write-Host ""
Write-Host "Tip: add -SkipFrontendInstall to skip npm install next time."
