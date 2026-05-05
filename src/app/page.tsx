"use client";

import { useState } from 'react';
import { Lock, Unlock, ShieldCheck, Plus, Trash2, Info, ArrowRight, Upload, Download, Copy, Check } from 'lucide-react';
import { CryptoAlgorithm, CryptoLayer } from '@/lib/crypto';
import Link from 'next/link';

const ALGORITHMS: { name: CryptoAlgorithm; description: string; requiresKey: boolean; placeholder?: string }[] = [
  { name: 'AES', description: 'Padrão avançado de criptografia. Muito seguro. Requer senha.', requiresKey: true, placeholder: 'Senha AES' },
  { name: 'DES', description: 'Padrão de criptografia antigo. Requer senha.', requiresKey: true, placeholder: 'Senha DES' },
  { name: 'TripleDES', description: 'Aplica DES três vezes para maior segurança. Requer senha.', requiresKey: true, placeholder: 'Senha 3DES' },
  { name: 'Rabbit', description: 'Cifra de fluxo de alta velocidade. Requer senha.', requiresKey: true, placeholder: 'Senha Rabbit' },
  { name: 'RC4', description: 'Cifra de fluxo clássica. Requer senha.', requiresKey: true, placeholder: 'Senha RC4' },
  { name: 'Caesar', description: 'Desloca letras do alfabeto. Requer um número inteiro como chave (ex: 3).', requiresKey: true, placeholder: 'Deslocamento (ex: 3)' },
  { name: 'Vigenere', description: 'Cifra polialfabética. Requer uma palavra como chave.', requiresKey: true, placeholder: 'Palavra-chave' },
  { name: 'ROT13', description: 'Desloca as letras em 13 posições. Não requer senha.', requiresKey: false },
  { name: 'Atbash', description: 'Inverte o alfabeto (A vira Z). Não requer senha.', requiresKey: false },
  { name: 'Affine', description: 'Usa função linear (ax+b). Requer dois números separados por vírgula (ex: 5,8). "a" deve ser coprimo de 26.', requiresKey: true, placeholder: 'a,b (ex: 5,8)' },
];

export default function Home() {
  const [tab, setTab] = useState<'encrypt' | 'decrypt'>('encrypt');
  
  // Encrypt State
  const [textToEncrypt, setTextToEncrypt] = useState('');
  const [layers, setLayers] = useState<CryptoLayer[]>([{ algorithm: 'AES', key: '' }]);
  const [encryptResult, setEncryptResult] = useState<{ code: string; encryptedText: string } | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  // Decrypt State
  const [codeToDecrypt, setCodeToDecrypt] = useState('');
  const [textToDecrypt, setTextToDecrypt] = useState('');
  const [decryptResult, setDecryptResult] = useState<{ text: string; layersReversed: number } | null>(null);
  const [decryptError, setDecryptError] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);

  // UI States
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedDecrypted, setCopiedDecrypted] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (text: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setter(content);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleDownload = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const addLayer = () => {
    if (layers.length < 5) {
      setLayers([...layers, { algorithm: 'AES', key: '' }]);
    }
  };

  const removeLayer = (index: number) => {
    if (layers.length > 1) {
      const newLayers = [...layers];
      newLayers.splice(index, 1);
      setLayers(newLayers);
    }
  };

  const updateLayer = (index: number, field: keyof CryptoLayer, value: string) => {
    const newLayers = [...layers];
    newLayers[index] = { ...newLayers[index], [field]: value };
    setLayers(newLayers);
  };

  const handleEncrypt = async () => {
    setIsEncrypting(true);
    setEncryptResult(null);
    try {
      const res = await fetch('/api/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToEncrypt, layers }),
      });
      const data = await res.json();
      if (res.ok) {
        setEncryptResult(data);
      } else {
        alert(data.error);
      }
    } catch (e) {
      alert("Erro ao conectar com o servidor.");
    }
    setIsEncrypting(false);
  };

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setDecryptResult(null);
    setDecryptError('');
    try {
      const res = await fetch('/api/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: codeToDecrypt, encryptedText: textToDecrypt }),
      });
      const data = await res.json();
      if (res.ok) {
        setDecryptResult({ text: data.decryptedText, layersReversed: data.layersReversed });
      } else {
        setDecryptError(data.error);
      }
    } catch (e) {
      setDecryptError("Erro ao conectar com o servidor.");
    }
    setIsDecrypting(false);
  };

  return (
    <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={36} color="var(--accent-color)" /> CryptoLayers
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>Criptografia multicamadas com máxima segurança.</p>
        <div style={{ marginTop: '1rem' }}>
          <Link href="/admin" style={{ color: 'var(--accent-color)', textDecoration: 'none', fontSize: '0.9rem' }}>
            Acesso Administrativo &rarr;
          </Link>
        </div>
      </header>

      <div className="glass-panel animate-fade-in">
        <div className="tab-container">
          <button 
            className={`tab ${tab === 'encrypt' ? 'active' : ''}`}
            onClick={() => setTab('encrypt')}
          >
            <Lock size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} /> Criptografar
          </button>
          <button 
            className={`tab ${tab === 'decrypt' ? 'active' : ''}`}
            onClick={() => setTab('decrypt')}
          >
            <Unlock size={18} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'middle' }} /> Descriptografar
          </button>
        </div>

        {tab === 'encrypt' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Texto Original</label>
                <label style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Upload size={16} /> Importar .txt
                  <input type="file" accept=".txt" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setTextToEncrypt)} />
                </label>
              </div>
              <textarea 
                rows={4} 
                placeholder="Digite o texto que deseja proteger..."
                value={textToEncrypt}
                onChange={e => setTextToEncrypt(e.target.value)}
              />
            </div>

            <div>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontWeight: 500 }}>
                <span>Camadas de Criptografia (Máx: 5)</span>
                {layers.length < 5 && (
                  <button type="button" onClick={addLayer} style={{ color: 'var(--success-color)', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.875rem' }}>
                    <Plus size={16} /> Adicionar Camada
                  </button>
                )}
              </label>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {layers.map((layer, index) => {
                  const algInfo = ALGORITHMS.find(a => a.name === layer.algorithm);
                  return (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--panel-border)' }}>
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>{index + 1}.</span>
                      <div style={{ flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select 
                          value={layer.algorithm}
                          onChange={(e) => updateLayer(index, 'algorithm', e.target.value)}
                          style={{ width: '150px' }}
                        >
                          {ALGORITHMS.map(a => <option key={a.name} value={a.name}>{a.name}</option>)}
                        </select>
                        <div className="info-icon-wrapper">
                          <Info size={16} />
                          <span className="info-tooltip">
                            <strong>{algInfo?.name}</strong><br/>
                            {algInfo?.description}
                          </span>
                        </div>
                      </div>
                      
                      {algInfo?.requiresKey ? (
                        <div style={{ flex: 2 }}>
                          <input 
                            type="text" 
                            placeholder={algInfo.placeholder} 
                            value={layer.key}
                            onChange={(e) => updateLayer(index, 'key', e.target.value)}
                          />
                        </div>
                      ) : (
                        <div style={{ flex: 2, color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem', textAlign: 'center' }}>
                          Sem chave
                        </div>
                      )}

                      <button 
                        type="button"
                        onClick={() => removeLayer(index)}
                        disabled={layers.length === 1}
                        style={{ color: layers.length === 1 ? 'var(--panel-border)' : 'var(--error-color)', background: 'transparent', padding: '0.5rem' }}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ marginTop: '1rem' }} 
              onClick={handleEncrypt}
              disabled={isEncrypting || !textToEncrypt}
            >
              {isEncrypting ? 'Processando...' : 'Criptografar Texto'}
            </button>

            {encryptResult && (
              <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', borderRadius: '0.5rem' }}>
                <h3 style={{ color: 'var(--success-color)', marginBottom: '1rem', textAlign: 'center' }}>Criptografia Concluída!</h3>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.9rem' }}>Código Alfanumérico (Guarde com segurança):</label>
                  <button onClick={() => copyToClipboard(encryptResult.code, setCopiedCode)} style={{ background: 'transparent', color: copiedCode ? 'var(--success-color)' : 'var(--text-secondary)', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.8rem' }}>
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />} {copiedCode ? 'Copiado' : 'Copiar'}
                  </button>
                </div>
                <div className="code-display" style={{ marginBottom: '1rem' }}>
                  {encryptResult.code}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.9rem' }}>Texto Criptografado:</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => copyToClipboard(encryptResult.encryptedText, setCopiedText)} style={{ background: 'transparent', color: copiedText ? 'var(--success-color)' : 'var(--text-secondary)', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      {copiedText ? <Check size={14} /> : <Copy size={14} />} {copiedText ? 'Copiado' : 'Copiar'}
                    </button>
                    <button onClick={() => handleDownload(encryptResult.encryptedText, 'texto_criptografado.txt')} style={{ background: 'transparent', color: 'var(--accent-color)', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      <Download size={14} /> Salvar .txt
                    </button>
                  </div>
                </div>
                <textarea 
                  readOnly 
                  rows={4} 
                  value={encryptResult.encryptedText} 
                  style={{ background: '#020617', borderColor: 'var(--success-color)' }}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'decrypt' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Código Alfanumérico</label>
              <input 
                type="text" 
                placeholder="Ex: X7K9-P2M1"
                value={codeToDecrypt}
                onChange={e => setCodeToDecrypt(e.target.value)}
                style={{ fontSize: '1.25rem', letterSpacing: '2px', textAlign: 'center' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 500 }}>Texto Criptografado</label>
                <label style={{ cursor: 'pointer', color: 'var(--accent-color)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Upload size={16} /> Importar .txt
                  <input type="file" accept=".txt" style={{ display: 'none' }} onChange={(e) => handleFileUpload(e, setTextToDecrypt)} />
                </label>
              </div>
              <textarea 
                rows={4} 
                placeholder="Cole o texto criptografado aqui..."
                value={textToDecrypt}
                onChange={e => setTextToDecrypt(e.target.value)}
              />
            </div>

            <button 
              className="btn-success" 
              style={{ marginTop: '1rem' }} 
              onClick={handleDecrypt}
              disabled={isDecrypting || !codeToDecrypt || !textToDecrypt}
            >
              {isDecrypting ? 'Revertendo Camadas...' : 'Descriptografar Texto'}
            </button>

            {decryptError && (
              <div style={{ color: 'var(--error-color)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '0.5rem', textAlign: 'center', marginTop: '1rem' }}>
                {decryptError}
              </div>
            )}

            {decryptResult && (
              <div style={{ marginTop: '1rem', padding: '1.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--success-color)', borderRadius: '0.5rem' }}>
                <h3 style={{ color: 'var(--success-color)', marginBottom: '0.5rem', textAlign: 'center' }}>Descriptografia Concluída</h3>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Foram revertidas {decryptResult.layersReversed} camadas de criptografia com sucesso.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label style={{ fontSize: '0.9rem' }}>Texto Original Revelado:</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => copyToClipboard(decryptResult.text, setCopiedDecrypted)} style={{ background: 'transparent', color: copiedDecrypted ? 'var(--success-color)' : 'var(--text-secondary)', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      {copiedDecrypted ? <Check size={14} /> : <Copy size={14} />} {copiedDecrypted ? 'Copiado' : 'Copiar'}
                    </button>
                    <button onClick={() => handleDownload(decryptResult.text, 'texto_descriptografado.txt')} style={{ background: 'transparent', color: 'var(--accent-color)', display: 'flex', gap: '0.25rem', alignItems: 'center', fontSize: '0.8rem' }}>
                      <Download size={14} /> Salvar .txt
                    </button>
                  </div>
                </div>
                <textarea 
                  readOnly 
                  rows={4} 
                  value={decryptResult.text} 
                  style={{ background: '#020617', borderColor: 'var(--success-color)' }}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
