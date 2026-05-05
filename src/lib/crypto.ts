import CryptoJS from 'crypto-js';

// Types of encryption
export type CryptoAlgorithm = 
  | 'AES' | 'DES' | 'TripleDES' | 'Rabbit' | 'RC4'
  | 'Caesar' | 'Vigenere' | 'ROT13' | 'Atbash' | 'Affine';

export interface CryptoLayer {
  algorithm: CryptoAlgorithm;
  key?: string; // Some algorithms like Atbash or ROT13 don't need a key. Caesar needs a number (passed as string), etc.
}

// ==========================================
// CUSTOM ALGORITHMS (Classical)
// ==========================================

// 1. Caesar Cipher (key is an integer shift)
function encryptCaesar(text: string, shiftStr: string): string {
  const shift = parseInt(shiftStr, 10) || 3;
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26 + 26) % 26 + base);
  });
}

function decryptCaesar(text: string, shiftStr: string): string {
  const shift = parseInt(shiftStr, 10) || 3;
  return encryptCaesar(text, (-shift).toString());
}

// 2. Vigenère Cipher (key is a string)
function encryptVigenere(text: string, key: string): string {
  if (!key) key = "KEY";
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const base = char <= 'Z' ? 65 : 97;
      const shift = key.charCodeAt(j % key.length) - 65;
      result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
      j++;
    } else {
      result += char;
    }
  }
  return result;
}

function decryptVigenere(text: string, key: string): string {
  if (!key) key = "KEY";
  key = key.toUpperCase().replace(/[^A-Z]/g, '');
  let result = '';
  let j = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (/[a-zA-Z]/.test(char)) {
      const base = char <= 'Z' ? 65 : 97;
      const shift = key.charCodeAt(j % key.length) - 65;
      result += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
      j++;
    } else {
      result += char;
    }
  }
  return result;
}

// 3. ROT13 (No key needed, shift is always 13)
function encryptROT13(text: string): string {
  return encryptCaesar(text, '13');
}

function decryptROT13(text: string): string {
  return encryptCaesar(text, '13'); // ROT13 is its own inverse
}

// 4. Atbash (No key needed, reverse alphabet)
function processAtbash(text: string): string {
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const offset = char.charCodeAt(0) - base;
    return String.fromCharCode(base + (25 - offset));
  });
}

// 5. Affine Cipher (Key is two integers separated by comma, e.g., '5,8'. a must be coprime to 26)
// Valid 'a' values for 26: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25
function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a: number, m: number): number {
  for (let x = 1; x < m; x++) {
    if (((a % m) * (x % m)) % m === 1) {
      return x;
    }
  }
  return 1;
}

function encryptAffine(text: string, keyStr: string): string {
  let [a, b] = keyStr.split(',').map(n => parseInt(n, 10));
  if (isNaN(a) || isNaN(b) || gcd(a, 26) !== 1) {
    a = 5; b = 8; // Default valid key
  }
  
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const x = char.charCodeAt(0) - base;
    return String.fromCharCode(((a * x + b) % 26) + base);
  });
}

function decryptAffine(text: string, keyStr: string): string {
  let [a, b] = keyStr.split(',').map(n => parseInt(n, 10));
  if (isNaN(a) || isNaN(b) || gcd(a, 26) !== 1) {
    a = 5; b = 8;
  }
  const a_inv = modInverse(a, 26);
  
  return text.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    const y = char.charCodeAt(0) - base;
    return String.fromCharCode(((a_inv * (y - b + 26)) % 26) + base);
  });
}


// ==========================================
// MAIN EXPORT FUNCTIONS
// ==========================================

export function encryptLayer(text: string, layer: CryptoLayer): string {
  const key = layer.key || 'DEFAULT_KEY';
  
  try {
    switch (layer.algorithm) {
      // CryptoJS Modern Algorithms
      case 'AES': return CryptoJS.AES.encrypt(text, key).toString();
      case 'DES': return CryptoJS.DES.encrypt(text, key).toString();
      case 'TripleDES': return CryptoJS.TripleDES.encrypt(text, key).toString();
      case 'Rabbit': return CryptoJS.Rabbit.encrypt(text, key).toString();
      case 'RC4': return CryptoJS.RC4.encrypt(text, key).toString();
      
      // Custom Classical Algorithms
      case 'Caesar': return encryptCaesar(text, key);
      case 'Vigenere': return encryptVigenere(text, key);
      case 'ROT13': return encryptROT13(text);
      case 'Atbash': return processAtbash(text);
      case 'Affine': return encryptAffine(text, key);
      
      default: return text;
    }
  } catch (error) {
    console.error(`Erro ao criptografar com ${layer.algorithm}:`, error);
    return text; // Fallback in case of wrong key format for crypto-js
  }
}

export function decryptLayer(text: string, layer: CryptoLayer): string {
  const key = layer.key || 'DEFAULT_KEY';
  
  try {
    switch (layer.algorithm) {
      // CryptoJS Modern Algorithms
      case 'AES': return CryptoJS.AES.decrypt(text, key).toString(CryptoJS.enc.Utf8) || 'ERRO_DE_CHAVE';
      case 'DES': return CryptoJS.DES.decrypt(text, key).toString(CryptoJS.enc.Utf8) || 'ERRO_DE_CHAVE';
      case 'TripleDES': return CryptoJS.TripleDES.decrypt(text, key).toString(CryptoJS.enc.Utf8) || 'ERRO_DE_CHAVE';
      case 'Rabbit': return CryptoJS.Rabbit.decrypt(text, key).toString(CryptoJS.enc.Utf8) || 'ERRO_DE_CHAVE';
      case 'RC4': return CryptoJS.RC4.decrypt(text, key).toString(CryptoJS.enc.Utf8) || 'ERRO_DE_CHAVE';
      
      // Custom Classical Algorithms
      case 'Caesar': return decryptCaesar(text, key);
      case 'Vigenere': return decryptVigenere(text, key);
      case 'ROT13': return decryptROT13(text);
      case 'Atbash': return processAtbash(text);
      case 'Affine': return decryptAffine(text, key);
      
      default: return text;
    }
  } catch (error) {
    console.error(`Erro ao descriptografar com ${layer.algorithm}:`, error);
    return 'ERRO_DE_CHAVE';
  }
}

// Wrapper for applying multiple layers
export function applyEncryptionLayers(text: string, layers: CryptoLayer[]): string {
  let currentText = text;
  for (const layer of layers) {
    currentText = encryptLayer(currentText, layer);
  }
  return currentText;
}

// Wrapper for reversing multiple layers
export function applyDecryptionLayers(text: string, layers: CryptoLayer[]): string {
  let currentText = text;
  // Descriptografar na ordem inversa
  const reversedLayers = [...layers].reverse();
  for (const layer of reversedLayers) {
    currentText = decryptLayer(currentText, layer);
  }
  return currentText;
}

// Helper to generate a random 8-character code
export function generateRandomCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  result += '-';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result; // e.g. "X7K9-P2M1"
}
