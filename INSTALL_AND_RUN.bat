@echo off
title CryptoLayers - Instalador e Inicializador
color 0D

echo ==================================================
echo   BEM-VINDO AO CRYPTOLAYERS (Setup Automático)
echo ==================================================
echo.

:: Verifica se o Node.js está instalado
node -v >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ERRO CRITICO: Node.js nao foi encontrado no sistema!
    echo Para que o CryptoLayers funcione, voce precisa baixar e instalar o Node.js.
    echo.
    echo Baixe a versao mais recente (LTS) em: https://nodejs.org/
    echo Apos a instalacao, reinicie o computador e tente novamente.
    echo.
    pause
    exit /b
)

cd /d "%~dp0"

echo Checando instalacao de dependencias...
IF NOT EXIST "node_modules" (
    echo.
    echo Parece ser a sua primeira vez rodando o programa!
    echo Vamos baixar os arquivos necessarios...
    call npm install
    IF %ERRORLEVEL% NEQ 0 (
        color 0C
        echo Erro durante a instalacao (npm install falhou).
        pause
        exit /b
    )
    echo Dependencias instaladas com sucesso!
) ELSE (
    echo Dependencias ja estao instaladas!
)

echo.
echo Iniciando o sistema...
call RUN.bat
