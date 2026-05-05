import { NextResponse } from 'next/server';
import { applyDecryptionLayers } from '@/lib/crypto';
import { getEncryptionRecipe } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, encryptedText } = body as { code: string; encryptedText: string };

    if (!code || !encryptedText) {
      return NextResponse.json({ error: 'Código e texto criptografado são obrigatórios.' }, { status: 400 });
    }

    const recipe = getEncryptionRecipe(code.toUpperCase());
    
    if (!recipe) {
      return NextResponse.json({ error: 'Código inválido ou não encontrado.' }, { status: 404 });
    }

    const decryptedText = applyDecryptionLayers(encryptedText, recipe);

    return NextResponse.json({ decryptedText, layersReversed: recipe.length });
  } catch (error) {
    console.error("Decrypt API error:", error);
    return NextResponse.json({ error: 'Erro ao processar descriptografia.' }, { status: 500 });
  }
}
