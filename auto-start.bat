@echo off
title PayPulse99 자동 실행기
color 0A

echo ========================================
echo    PayPulse99 자동 실행 시스템
echo ========================================
echo.
echo 자동 모드로 실행됩니다...
echo 사용자 확인 없이 모든 단계를 자동으로 진행합니다.
echo.

cd /d "%~dp0"

echo 1단계: 의존성 확인...
if not exist "node_modules" (
    echo node_modules가 없습니다. npm install을 실행합니다...
    npm install --yes
) else (
    echo 의존성이 이미 설치되어 있습니다.
)

echo.
echo 2단계: 개발 서버 시작...
echo 자동으로 http://localhost:3000 에서 실행됩니다.
echo.

npm run auto-dev

echo.
echo 서버가 종료되었습니다.
pause
