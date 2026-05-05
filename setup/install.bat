@echo off
title CryptoLayers - Instalador de Dependencias
color 0E

echo ==================================================
echo      INSTALADOR DE DEPENDENCIAS - CRYPTOLAYERS
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
    echo Apos a instalacao, reinicie o computador ou este terminal e tente novamente.
    echo.
    pause
    exit /b
)

echo Node.js encontrado com sucesso!
echo Versao do Node:
node -v
echo Versao do NPM:
call npm -v
echo.

echo ==================================================
echo Instalando todas as dependencias (Isso pode demorar um pouco)...
echo ==================================================
cd /d "%~dp0\.."
call npm install

IF %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo Ocorreu um erro durante a instalacao. 
    echo Verifique sua conexao de internet ou reinstale o Node.js marcando a opcao de instalar "Build Tools".
    echo.
    pause
    exit /b
)

color 0A
echo.
echo ==================================================
echo Instalacao concluida com SUCESSO!
echo ==================================================
echo Voce ja pode rodar o programa usando o arquivo RUN.bat.
echo.
pause
