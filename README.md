# CryptoLayers 🛡️

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

*(English version below / Versão em inglês abaixo)*

---

## 🇧🇷 Português

**CryptoLayers** é uma aplicação web local focada em segurança multicamadas. Desenvolvida para ser uma ferramenta robusta e ao mesmo tempo ter uma interface agradável ("glassmorphism" relaxante), ela permite criptografar textos usando até 5 camadas diferentes de criptografia consecutivas, gerando uma "chave alfanumérica" mestre. 

### ✨ Funcionalidades
- **Criptografia em Camadas:** Combine algoritmos modernos (AES, DES, TripleDES, Rabbit, RC4) e clássicos (Cifra de César, Vigenère, ROT13, Atbash, Afim).
- **Importação/Exportação:** Envie arquivos `.txt` e baixe os resultados com apenas um clique.
- **Banco de Dados Seguro:** As chaves de criptografia ficam salvas em um banco SQLite (`data/cryptolayers.sqlite`), porém são criptografadas via AES no próprio banco, garantindo proteção contra curiosos que tentarem abrir o arquivo `.sqlite`.
- **Área Administrativa:** Rota `/admin` para verificar históricos de geração de códigos.

### 🚀 Como Executar (Usuários Windows)
A forma mais fácil de rodar o programa é através dos arquivos `.bat` fornecidos na raiz:

1. Instale o **[Node.js](https://nodejs.org)** (versão LTS).
2. Dê dois cliques em **`INSTALL_AND_RUN.bat`**. O script irá verificar os requisitos, instalar tudo sozinho e abrir o navegador automaticamente.
3. Para as próximas vezes, basta usar **`RUN.bat`**.

> Se preferir instalar as dependências separadamente, há uma pasta `setup/` com scripts dedicados e a documentação técnica `REQUIREMENTS.md`.

### 👨‍💻 Como Executar (Desenvolvedores)
```bash
# 1. Clone o repositório
git clone https://github.com/kbd003/CryptoLayers.git

# 2. Entre na pasta
cd CryptoLayers

# 3. Instale as dependências
npm install

# 4. Inicie o servidor
npm run dev
```

---

## 🇺🇸 English

**CryptoLayers** is a local web application focused on multi-layered security. Designed to be robust while maintaining a pleasant user interface (relaxing glassmorphism), it allows you to encrypt texts using up to 5 different consecutive encryption layers, generating a master "alphanumeric key".

### ✨ Features
- **Layered Encryption:** Combine modern algorithms (AES, DES, TripleDES, Rabbit, RC4) and classic ones (Caesar Cipher, Vigenère, ROT13, Atbash, Affine).
- **Import/Export:** Upload `.txt` files and download the results with a single click.
- **Secure Database:** Encryption keys are stored in a SQLite database (`data/cryptolayers.sqlite`), but they are encrypted via AES within the database itself, ensuring protection against snoopers attempting to open the `.sqlite` file.
- **Admin Area:** `/admin` route to check code generation history.

### 🚀 How to Run (Windows Users)
The easiest way to run the program is through the `.bat` files provided in the root folder:

1. Install **[Node.js](https://nodejs.org)** (LTS version).
2. Double-click **`INSTALL_AND_RUN.bat`**. The script will check the requirements, install everything automatically, and open the browser.
3. For future uses, just use **`RUN.bat`**.

> If you prefer to install dependencies separately, there is a `setup/` folder with dedicated scripts and technical documentation in `REQUIREMENTS.md`.

### 👨‍💻 How to Run (Developers)
```bash
# 1. Clone the repository
git clone https://github.com/kbd003/CryptoLayers.git

# 2. Enter the directory
cd CryptoLayers

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```
