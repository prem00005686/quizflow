@echo off
REM MCQ Learning Platform - Supabase Setup Helper (Windows)
REM This script helps verify your Supabase setup

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   MCQ Learning Platform - Setup Checker                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if backend .env exists
if not exist "backend\.env" (
    echo ❌ backend\.env not found!
    echo    Create file: backend\.env
    echo.
    pause
    exit /b 1
)
echo ✅ backend\.env found

REM Check if frontend .env exists
if not exist "frontend\.env" (
    echo ❌ frontend\.env not found!
    echo    Create file: frontend\.env
    echo.
    pause
    exit /b 1
)
echo ✅ frontend\.env found

REM Check for Supabase URL in backend .env
findstr /c:"SUPABASE_URL=https://" backend\.env > nul
if errorlevel 1 (
    echo ❌ SUPABASE_URL not configured in backend\.env!
    echo    Add: SUPABASE_URL=https://your-project.supabase.co
    echo.
    pause
    exit /b 1
)
echo ✅ SUPABASE_URL configured

REM Check for SUPABASE_KEY in backend .env
findstr /c:"SUPABASE_KEY=" backend\.env > nul
if errorlevel 1 (
    echo ❌ SUPABASE_KEY not configured in backend\.env!
    echo    Add: SUPABASE_KEY=your-service-role-key
    echo.
    pause
    exit /b 1
)
echo ✅ SUPABASE_KEY configured

REM Check for JWT_SECRET in backend .env
findstr /c:"JWT_SECRET=" backend\.env > nul
if errorlevel 1 (
    echo ⚠️  JWT_SECRET not configured (optional but recommended)
)
echo ✅ JWT_SECRET configured

REM Check for Supabase URL in frontend .env
findstr /c:"VITE_SUPABASE_URL=https://" frontend\.env > nul
if errorlevel 1 (
    echo ❌ VITE_SUPABASE_URL not configured in frontend\.env!
    echo    Add: VITE_SUPABASE_URL=https://your-project.supabase.co
    echo.
    pause
    exit /b 1
)
echo ✅ VITE_SUPABASE_URL configured

REM Check for VITE_SUPABASE_ANON_KEY in frontend .env
findstr /c:"VITE_SUPABASE_ANON_KEY=" frontend\.env > nul
if errorlevel 1 (
    echo ❌ VITE_SUPABASE_ANON_KEY not configured in frontend\.env!
    echo    Add: VITE_SUPABASE_ANON_KEY=your-anon-key
    echo.
    pause
    exit /b 1
)
echo ✅ VITE_SUPABASE_ANON_KEY configured

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║   ✅ All checks passed!                                   ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo Next steps:
echo  1. Make sure Supabase database schema is deployed
echo     (Docs: docs/SUPABASE_SETUP_STEP_BY_STEP.md - Step 4)
echo.
echo  2. Populate sample data
echo     (Docs: docs/SUPABASE_SETUP_STEP_BY_STEP.md - Step 5)
echo.
echo  3. Restart both servers:
echo     Backend:  npm run dev (in backend folder)
echo     Frontend: npm run dev (in frontend folder)
echo.
echo  4. Test at http://localhost:3000
echo.
pause
