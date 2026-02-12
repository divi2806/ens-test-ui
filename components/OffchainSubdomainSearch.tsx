'use client';

import { useState } from 'react';
import { GATEWAY_API_URL, PARENT_DOMAIN } from '@/lib/config';

const PARENT_SUBDOMAINS = ['test', 'test2'] as const;

interface RegisteredRecord {
  name: string;
  node: string;
  record: {
    addr: string | null;
    texts: Record<string, string>;
    registeredAt: string;
  };
}

export function OffchainSubdomainSearch() {
  const [label, setLabel] = useState('');
  const [parent, setParent] = useState<(typeof PARENT_SUBDOMAINS)[number]>('test');
  const [isRegistering, setIsRegistering] = useState(false);
  const [result, setResult] = useState<RegisteredRecord | null>(null);
  const [error, setError] = useState('');

  const fullName = label ? `${label.trim().toLowerCase()}.${parent}.${PARENT_DOMAIN}` : '';

  const handleRegister = async () => {
    const cleanLabel = label.trim().toLowerCase();
    if (!cleanLabel) {
      setError('Please enter a subdomain label');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(cleanLabel) || cleanLabel.startsWith('-') || cleanLabel.endsWith('-')) {
      setError('Invalid label. Use only lowercase letters, numbers, and hyphens (not at start/end)');
      return;
    }

    setError('');
    setResult(null);
    setIsRegistering(true);

    try {
      const name = `${cleanLabel}.${parent}.${PARENT_DOMAIN}`;
      const res = await fetch(`${GATEWAY_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          addr: null,
          texts: { description: `Offchain subdomain: ${name}` },
        }),
      });

      const data = await res.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Gateway error: ${message}. Is the gateway running?`);
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Registration Box */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center text-white text-xl">
            ~
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Offchain Sub-subdomain</h2>
            <p className="text-purple-200 text-sm">No gas required — resolved via CCIP-Read</p>
          </div>
        </div>

        {/* Parent selector */}
        <div className="mb-4">
          <label className="block text-sm text-purple-200 mb-2">Parent subdomain</label>
          <div className="flex gap-2">
            {PARENT_SUBDOMAINS.map((p) => (
              <button
                key={p}
                onClick={() => setParent(p)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  parent === p
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {p}.{PARENT_DOMAIN}
              </button>
            ))}
          </div>
        </div>

        {/* Label input */}
        <div className="flex items-center gap-3 mb-4">
          <input
            type="text"
            value={label}
            onChange={(e) => { setLabel(e.target.value); setError(''); setResult(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
            placeholder="Enter label (e.g., alice, 1, myname)"
            className="flex-1 px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:border-indigo-400 focus:outline-none text-lg text-white placeholder:text-white/40"
          />
          <span className="text-lg font-semibold text-purple-200 whitespace-nowrap">
            .{parent}.{PARENT_DOMAIN}
          </span>
        </div>

        <button
          onClick={handleRegister}
          disabled={isRegistering || !label.trim()}
          className="w-full bg-indigo-500 text-white py-3 rounded-lg font-semibold hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isRegistering ? 'Registering...' : 'Register Offchain Subdomain'}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-400/30 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}
      </div>

      {/* Success result */}
      {result && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-400/30 rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-white">{result.name}</h3>
            <span className="px-4 py-2 rounded-full text-sm font-bold bg-green-500 text-white">
              Registered
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-white/10 rounded-lg p-4">
            <div>
              <p className="text-sm text-green-200">Node (namehash)</p>
              <p className="font-mono text-xs text-white break-all">{result.node}</p>
            </div>
            <div>
              <p className="text-sm text-green-200">Registered at</p>
              <p className="text-white">{new Date(result.record.registeredAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-green-200">Address</p>
              <p className="text-white font-mono text-sm">{result.record.addr || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-green-200">Resolution</p>
              <p className="text-white">CCIP-Read (offchain)</p>
            </div>
          </div>

          <p className="mt-4 text-green-200 text-sm">
            This subdomain resolves via the CCIP-Read gateway. No on-chain transaction was needed.
          </p>
        </div>
      )}
    </div>
  );
}
