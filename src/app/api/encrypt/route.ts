import { NextResponse } from 'next/server';
import { CryptoLayer, applyEncryptionLayers, generateRandomCode } from '@/lib/crypto';
import { saveEncryptionRecord } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, layers } = body as { text: string; layers: CryptoLayer[] };

    if (!text || !layers || layers.length === 0 || layers.length > 5) {
      return NextResponse.json({ error: 'Texto e camadas (1 a 5) são obrigatórios.' }, { status: 400 });
    }

    const encryptedText = applyEncryptionLayers(text, layers);
    const code = generateRandomCode();
    
    // Save to DB
    saveEncryptionRecord(code, layers);

    return NextResponse.json({ code, encryptedText });
  } catch (error) {
    console.error("Encrypt API error:", error);
    return NextResponse.json({ error: 'Erro ao processar criptografia.' }, { status: 500 });
  }
}
