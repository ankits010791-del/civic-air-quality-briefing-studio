'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck, ExternalLink } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  customApiKey,
  onSaveApiKey,
}: SettingsModalProps) {
  const [inputKey, setInputKey] = useState(customApiKey);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setInputKey(customApiKey);
  }, [customApiKey]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setStatusMessage('Settings updated successfully.');
  };

  const handleTestConnection = async () => {
    setTestingStatus('testing');
    setStatusMessage('Contacting Gemini 2.5 Flash endpoint...');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(inputKey.trim() ? { 'x-gemini-api-key': inputKey.trim() } : {}),
        },
        body: JSON.stringify({
          rawData: 'Timestamp,Sensor,Pollutant,Raw_Reading,Unit\n2025-11-14 08:00,TEST-01,PM2.5,45.2,ug/m3',
          customApiKey: inputKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `HTTP ${res.status}: Failed to reach Gemini.`);
      }

      setTestingStatus('success');
      setStatusMessage('Connection Verified! Successfully invoked Gemini 2.5 Flash.');
    } catch (err: any) {
      setTestingStatus('error');
      setStatusMessage(err.message || 'Connection test failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <Key className="h-5 w-5 text-cyan-400" />
            <h3 className="text-lg font-semibold text-white">Studio API & Deployment Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800/80">
            <div className="flex items-start space-x-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-semibold text-white">Vercel & Server Environment Support</p>
                <p className="text-slate-400">
                  By default, the Studio reads <code className="text-cyan-300">process.env.GEMINI_API_KEY</code> from your server environment or <code className="text-cyan-300">.env.local</code>.
                </p>
                <p className="text-slate-400">
                  For immediate hackathon evaluation or testing alternative quotas, you can also paste an active key below. It is stored securely in your browser session only.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy... (leave blank to rely on server process.env.GEMINI_API_KEY)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>
            <p className="mt-1.5 text-xs text-slate-400 flex items-center justify-between">
              <span>Required Model: <strong className="text-cyan-400">gemini-2.5-flash</strong></span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline flex items-center gap-1"
              >
                Get API Key <ExternalLink className="h-3 w-3" />
              </a>
            </p>
          </div>

          {statusMessage && (
            <div
              className={`flex items-start space-x-2 rounded-xl p-3 text-xs ${
                testingStatus === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                  : testingStatus === 'error'
                  ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {testingStatus === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : testingStatus === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              ) : (
                <RefreshCw className="h-4 w-4 shrink-0 text-cyan-400 animate-spin mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <button
              onClick={handleTestConnection}
              disabled={testingStatus === 'testing'}
              className="flex items-center space-x-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-slate-700 hover:text-white disabled:opacity-50"
            >
              {testingStatus === 'testing' ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              )}
              <span>Test Gemini Ping</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-600/30 hover:bg-cyan-500"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
