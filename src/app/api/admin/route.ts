import { NextResponse } from 'next/server';
import { getAllRecords } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body as { password?: string };

    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Senha incorreta.' }, { status: 401 });
    }

    const records = getAllRecords();
    return NextResponse.json({ records });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json({ error: 'Erro ao buscar registros.' }, { status: 500 });
  }
}
