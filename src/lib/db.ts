import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import { CryptoLayer } from './crypto';

// Use a secure location for the database
const DB_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const DB_PATH = path.join(DB_DIR, 'cryptolayers.sqlite');
const db = new Database(DB_PATH);

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS encryption_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    encrypted_recipe TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Mestre password to encrypt data inside the database.
// In a real scenario, this would be strictly in an .env file.
// We provide a fallback here.
const MASTER_DB_KEY = process.env.MASTER_DB_KEY || 'CryptoLayers_Secret_Master_Key_2026';

export function saveEncryptionRecord(code: string, recipe: CryptoLayer[]) {
  // Encrypt the recipe before saving to DB to prevent manual DB snooping
  const recipeJson = JSON.stringify(recipe);
  const encryptedRecipe = CryptoJS.AES.encrypt(recipeJson, MASTER_DB_KEY).toString();

  const stmt = db.prepare('INSERT INTO encryption_records (code, encrypted_recipe) VALUES (?, ?)');
  stmt.run(code, encryptedRecipe);
}

export function getEncryptionRecipe(code: string): CryptoLayer[] | null {
  const stmt = db.prepare('SELECT encrypted_recipe FROM encryption_records WHERE code = ?');
  const row = stmt.get(code) as { encrypted_recipe: string } | undefined;

  if (!row) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(row.encrypted_recipe, MASTER_DB_KEY);
    const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedJson) as CryptoLayer[];
  } catch (error) {
    console.error("Failed to decrypt recipe from database:", error);
    return null;
  }
}

export function getAllRecords() {
  const stmt = db.prepare('SELECT id, code, created_at, encrypted_recipe FROM encryption_records ORDER BY created_at DESC');
  const rows = stmt.all() as { id: number, code: string, created_at: string, encrypted_recipe: string }[];
  
  // Try to decrypt for the admin view
  return rows.map(row => {
    let recipeStr = 'Erro ao descriptografar';
    try {
      const bytes = CryptoJS.AES.decrypt(row.encrypted_recipe, MASTER_DB_KEY);
      const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
      const recipe = JSON.parse(decryptedJson) as CryptoLayer[];
      recipeStr = recipe.map(r => r.algorithm).join(' -> ');
    } catch (e) {
      // ignore
    }
    return {
      id: row.id,
      code: row.code,
      createdAt: row.created_at,
      recipeSummary: recipeStr
    };
  });
}
