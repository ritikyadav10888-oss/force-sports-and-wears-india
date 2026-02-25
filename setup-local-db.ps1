# Switch to Local SQLite Development
Write-Host "🚀 Switching to Local SQLite Development..." -ForegroundColor Cyan

# 1. Update .env to use SQLite
$envFile = "packages/api/.env"
$envContent = Get-Content $envFile
$envContent = $envContent -replace 'DATABASE_URL=.*', 'DATABASE_URL="file:./dev.db"'
$envContent | Set-Content $envFile
Write-Host "✅ Updated packages/api/.env with SQLite path." -ForegroundColor Green

# 2. Backup original schema
if (-not (Test-Path "packages/api/prisma/schema.prisma.bak")) {
    Copy-Item "packages/api/prisma/schema.prisma" "packages/api/prisma/schema.prisma.bak"
    Write-Host "✅ Backed up original schema.prisma." -ForegroundColor Green
}

# 3. Apply SQLite schema
Copy-Item "packages/api/prisma/schema.dev.prisma" "packages/api/prisma/schema.prisma"
Write-Host "✅ Applied SQLite-compatible schema." -ForegroundColor Green

# 4. Generate Client and Push DB
Write-Host "📦 Initializing SQLite database..." -ForegroundColor Yellow
cd packages/api
npx prisma generate
npx prisma db push --force-reset
npx tsx prisma/seed.ts

Write-Host "✨ Local SQLite Database is READY!" -ForegroundColor Green
Write-Host "You can now register and login locally." -ForegroundColor Cyan
