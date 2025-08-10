# PayPulse99 자동 실행 스크립트 (자동 모드)
Write-Host "PayPulse99 애플리케이션을 자동으로 시작합니다..." -ForegroundColor Green
Write-Host ""
Write-Host "브라우저에서 http://localhost:3000 으로 접속하세요." -ForegroundColor Yellow
Write-Host ""
Write-Host "자동 모드: 사용자 확인 없이 실행됩니다." -ForegroundColor Cyan
Write-Host ""

# 현재 디렉토리로 이동
Set-Location $PSScriptRoot

# 자동 모드로 애플리케이션 시작
try {
    npm run auto-dev
} catch {
    Write-Host "오류가 발생했습니다: $_" -ForegroundColor Red
    Write-Host "자동으로 다음 단계로 진행합니다..." -ForegroundColor Yellow
    npm run dev
}
