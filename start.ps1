# SwarmStudio - One-Click Launch Script
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host "             SWARMSTUDIO CREATIVE PLATFORM                " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Magenta
Write-Host ""

$BackendDir = Join-Path $PSScriptRoot "backend"
$FrontendDir = Join-Path $PSScriptRoot "frontend"
$PythonExe = Join-Path $BackendDir "venv\Scripts\python.exe"

# 1. Start FastAPI Backend Server
Write-Host "[1/3] Starting SwarmStudio Backend API on http://127.0.0.1:8000..." -ForegroundColor Yellow
$BackendProcess = Start-Process -FilePath $PythonExe -ArgumentList "$BackendDir\run.py" -PassThru -WindowStyle Normal

# Wait for backend to initialize
Start-Sleep -Seconds 3

# 2. Start Vite React Frontend
Write-Host "[2/3] Starting SwarmStudio Frontend on http://localhost:5173..." -ForegroundColor Yellow
$FrontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"$FrontendDir`" && npm run dev" -PassThru -WindowStyle Normal

Start-Sleep -Seconds 2

# 3. Open in Browser
Write-Host "[3/3] Opening SwarmStudio in default browser..." -ForegroundColor Green
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "SwarmStudio is running!" -ForegroundColor Cyan
Write-Host "Backend API: http://127.0.0.1:8000 (Docs: http://127.0.0.1:8000/docs)" -ForegroundColor Gray
Write-Host "Frontend:    http://localhost:5173" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to stop both servers..." -ForegroundColor DarkYellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host "Stopping servers..." -ForegroundColor Red
Stop-Process -Id $BackendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $FrontendProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "All processes stopped. Goodbye!" -ForegroundColor Gray
