# deploy-vercel.ps1
$env:VERCEL_TOKEN = "I1pgu37BxoAq3nbtG9rWEYk4"
Set-Location "C:\Users\hp\volsim-pro\volsim-pro\client"

Write-Host "📦 Step 1: Building React..." -ForegroundColor Cyan
npm run build

Write-Host "☁️  Step 2: Deploying to Vercel..." -ForegroundColor Cyan
# This command captures the URL directly into the variable
$deployUrl = vercel --prod --token $env:VERCEL_TOKEN --confirm | Out-String
$deployUrl = $deployUrl.Trim()

Write-Host "🔗 Step 3: Aliasing $deployUrl" -ForegroundColor Cyan
vercel alias set $deployUrl "volsim-pro-client.vercel.app" --token $env:VERCEL_TOKEN

Write-Host "`n✅ VOLSIM PRO IS LIVE!" -ForegroundColor Green
Write-Host "Link: https://volsim-pro-client.vercel.app" -ForegroundColor White