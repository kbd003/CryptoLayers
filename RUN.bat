@echo off
title CryptoLayers - Servidor
color 0B

echo ==================================================
echo         INICIANDO O SISTEMA CRYPTOLAYERS
echo ==================================================
echo.

:: Verifica se o Node.js está instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERRO: Node.js nao encontrado.
    echo Por favor, rode o INSTALL_AND_RUN.bat ou instale o Node.js primeiro.
    pause
    exit /b
)

:: Verifica se a pasta node_modules existe (se as dependências foram instaladas)
IF NOT EXIST "%~dp0node_modules" (
    color 0E
    echo AVISO: As dependencias nao foram instaladas ainda.
    echo Feche este arquivo e rode "INSTALL_AND_RUN.bat" pela primeira vez.
    echo.
    pause
    exit /b
)

echo Navegando para a pasta do projeto...
cd /d "%~dp0"

echo.
echo O navegador abrira automaticamente em alguns segundos...
start "Aguardando Servidor" cmd /c "timeout /t 4 /nobreak >nul && start http://localhost:3000"

echo.
echo Iniciando o servidor local Next.js...
echo Por favor, NAO FECHE esta janela enquanto estiver usando o software.
echo Pressione Ctrl+C quando quiser desligar o servidor.
echo.

call npm run dev
