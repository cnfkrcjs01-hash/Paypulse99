@echo off
echo PayPulse99 애플리케이션을 자동으로 시작합니다...
echo.
echo 브라우저에서 http://localhost:3000 으로 접속하세요.
echo.
echo 자동 모드: 사용자 확인 없이 실행됩니다.
echo.
cd /d "%~dp0"
npm run auto-dev
