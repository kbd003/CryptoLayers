"use client";

import { useState } from 'react';
import { Database, Lock, ArrowLeft, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [records, setRecords] = useState<{ id: number; code: string; createdAt: string; recipeSummary: string }[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setIsAuthenticated(true);
        setRecords(data.records);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    }
    
    setIsLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <ArrowLeft size={18} /> Voltar ao Início
        </Link>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Shield size={24} color="var(--error-color)" /> Área Restrita
        </h2>
      </header>

      <div className="glass-panel animate-fade-in">
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <Lock size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
              <h3>Painel de Administração</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                Acesso exclusivo para administradores do sistema.
              </p>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Senha do Administrador</label>
              <input 
                type="password" 
                placeholder="Insira a senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            
            {error && <div style={{ color: 'var(--error-color)', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}
            
            <button type="submit" className="btn-primary" disabled={isLoading || !password}>
              {isLoading ? 'Autenticando...' : 'Acessar Banco de Dados'}
            </button>
          </form>
        ) : (
          <div className="animate-fade-in">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--panel-border)', paddingBottom: '1rem' }}>
              <Database size={24} color="var(--accent-color)" />
              <h3 style={{ margin: 0 }}>Registros de Criptografia</h3>
              <span style={{ marginLeft: 'auto', background: 'var(--panel-bg)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem' }}>
                {records.length} total
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--panel-border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>ID</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Código Gerado</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Data/Hora</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Resumo das Camadas</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                        Nenhum registro encontrado no banco de dados.
                      </td>
                    </tr>
                  ) : (
                    records.map(record => (
                      <tr key={record.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                        <td style={{ padding: '1rem 0.5rem', color: 'var(--text-secondary)' }}>{record.id}</td>
                        <td style={{ padding: '1rem 0.5rem', fontFamily: 'monospace', color: 'var(--success-color)' }}>{record.code}</td>
                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem' }}>{new Date(record.createdAt + 'Z').toLocaleString()}</td>
                        <td style={{ padding: '1rem 0.5rem', fontSize: '0.9rem' }}>{record.recipeSummary}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Aviso: As chaves usadas nas camadas ficam criptografadas na tabela e são abertas apenas quando necessário para descriptografia pelo usuário final.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
