# Requisitos e Dependências (Requirements)

Este documento lista tudo o que é necessário para executar o CryptoLayers localmente.

## Requisitos do Sistema
- **Sistema Operacional:** Windows 10/11, Linux, ou macOS.
- **Node.js:** Versão 18.x ou superior (Recomendado: 20.x LTS). O `npm` é incluído automaticamente na instalação do Node.js.
- **Python / C++ Build Tools (Opcional, mas recomendado no Windows):** Como usamos o `better-sqlite3`, algumas vezes o sistema precisa compilar os binários nativamente se os binários pré-compilados falharem. O comando `npm install` geralmente lida com isso se você instalar o Node.js marcando a opção "Instalar ferramentas necessárias (Chocolatey, Python, Visual Studio Build Tools)".

## Dependências de Produção (npm)
Essas são as bibliotecas instaladas na sua máquina (dentro da pasta `node_modules`) que fazem o código rodar:
- `next` (Framework React)
- `react` e `react-dom` (Biblioteca de UI)
- `crypto-js` (Algoritmos de Criptografia padrão da indústria: AES, DES, Rabbit, RC4)
- `better-sqlite3` (Conexão nativa e rápida com o banco de dados SQLite)
- `lucide-react` (Ícones vetoriais em SVG)

## Dependências de Desenvolvimento (npm)
Usadas apenas para tipagem e compilação de código:
- `typescript`
- `@types/node`
- `@types/react`
- `@types/crypto-js`
- `@types/better-sqlite3`
- `eslint` e `eslint-config-next`

## O que já havia na máquina do desenvolvedor original
- Node.js (`v20.x` ou `v22.x`) e `npm`.
- Permissões de administrador para rodar servidores locais na porta 3000.
- Ambiente Git (para versionamento do código).
