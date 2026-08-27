'use client';

import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Radio,
  Send,
  Save,
} from 'lucide-react';
import { EnvironmentMode } from '@/types/message';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [channelId, setChannelId] = useState('');
  const [channelSecret, setChannelSecret] = useState('');
  const [channelAccessToken, setChannelAccessToken] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [environmentMode, setEnvironmentMode] = useState<EnvironmentMode>('development');
  const [defaultTestUserId, setDefaultTestUserId] = useState('');

  const [hasSecret, setHasSecret] = useState(false);
  const [hasAccessToken, setHasAccessToken] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | undefined>(undefined);

  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [saveBanner, setSaveBanner] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setChannelId(data.channelId || '');
          setChannelSecret(data.channelSecret || '');
          setChannelAccessToken(data.channelAccessToken || '');
          setGeminiApiKey(data.geminiApiKey || '');
          setEnvironmentMode(data.environmentMode || 'development');
          setDefaultTestUserId(data.defaultTestUserId || '');
          setHasSecret(data.hasSecret);
          setHasAccessToken(data.hasAccessToken);
          setHasGeminiKey(data.hasGeminiKey);
          setIsConnected(data.isConnected);
          setLastCheckedAt(data.lastCheckedAt);
        }
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveBanner(false);

    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channelId,
          channelSecret,
          channelAccessToken,
          geminiApiKey,
          environmentMode,
          defaultTestUserId,
        }),
      });

      if (res.ok) {
        setSaveBanner(true);
        window.dispatchEvent(new Event('settings-updated'));
        setTimeout(() => setSaveBanner(false), 3000);
      }
    } catch {
      alert('เกิดข้อผิดพลาดในการบันทึกการตั้งค่า');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/line/test-connection', { method: 'POST' });
      const data = await res.json();
      setTestResult(data);
      setIsConnected(data.success);
      setLastCheckedAt(new Date().toISOString());
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'ไม่สามารถทดสอบการเชื่อมต่อได้',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900">ตั้งค่าระบบ (System Settings)</h1>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1',
                isConnected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  isConnected ? 'bg-emerald-600' : 'bg-slate-400'
                )}
              />
              <span>{isConnected ? 'LINE Connected' : 'Not Connected'}</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            เชื่อมต่อ LINE Official Account Messaging API และตั้งค่าความปลอดภัยในการ Broadcast
          </p>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors disabled:opacity-50"
        >
          {isTesting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
          )}
          <span>ทดสอบการเชื่อมต่อ (Test Connection)</span>
        </button>
      </div>

      {/* Test Connection Banner Result */}
      {testResult && (
        <div
          className={`p-4 rounded-2xl border text-xs space-y-1 ${
            testResult.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="font-bold flex items-center gap-2">
            {testResult.success ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>ผลการเชื่อมต่อ: สำเร็จ</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span>ผลการเชื่อมต่อ: ไม่สำเร็จ</span>
              </>
            )}
          </div>
          <p className="leading-relaxed">{testResult.message}</p>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Environment Safety Mode (Requirement 17) */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <ShieldCheck className="h-5 w-5 text-[#06C755]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                โหมดความปลอดภัยของสภาพแวดล้อม (Environment Mode)
              </h3>
              <p className="text-xs text-slate-500">
                ป้องกันการส่งข้อความ Broadcast จริงสู่ลูกค้าในระหว่างพัฒนาและทดสอบระบบ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Development Mode Option */}
            <div
              onClick={() => setEnvironmentMode('development')}
              className={cn(
                'rounded-2xl border p-4 cursor-pointer transition-all space-y-2',
                environmentMode === 'development'
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldCheck className="h-4 w-4 text-blue-600" />
                  <span>DEVELOPMENT (โหมดปลอดภัย)</span>
                </div>
                <input
                  type="radio"
                  checked={environmentMode === 'development'}
                  onChange={() => setEnvironmentMode('development')}
                  className="text-blue-600"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>ปิดการ Broadcast จริง</strong> เพื่อความปลอดภัย<br />
                • อนุญาตเฉพาะการใช้ฟังก์ชัน <strong>Send Test</strong> ไปยัง User ID ทดสอบ
              </p>
            </div>

            {/* Production Mode Option */}
            <div
              onClick={() => setEnvironmentMode('production')}
              className={cn(
                'rounded-2xl border p-4 cursor-pointer transition-all space-y-2',
                environmentMode === 'production'
                  ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/30'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <ShieldAlert className="h-4 w-4 text-amber-600" />
                  <span>PRODUCTION (โหมดส่งจริง)</span>
                </div>
                <input
                  type="radio"
                  checked={environmentMode === 'production'}
                  onChange={() => setEnvironmentMode('production')}
                  className="text-amber-600"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                • <strong>เปิดใช้งาน Broadcast</strong> ถึงผู้ติดตามทั้งหมดได้<br />
                • ต้องผ่านการกดยืนยันใน Modal ก่อนยิงทุกครั้ง
              </p>
            </div>
          </div>
        </div>

        {/* 2. LINE Messaging API Connection (Requirement 31 & 32) */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xl space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Key className="h-5 w-5 text-[#06C755]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                LINE Official Account Messaging API Credentials
              </h3>
              <p className="text-xs text-slate-500">
                ข้อมูลคีย์เชื่อมต่อจาก LINE Developers Console (ระบบจะ Mask ซ่อนความลับเสมอ)
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Channel ID
              </label>
              <input
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                placeholder="2001992825"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>Channel Secret</span>
                {hasSecret && <span className="text-[10px] text-emerald-600 font-bold">✓ ตั้งค่าแล้ว</span>}
              </label>
              <input
                type="password"
                value={channelSecret}
                onChange={(e) => setChannelSecret(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Channel Access Token (Long-Lived)</span>
              {hasAccessToken && <span className="text-[10px] text-emerald-600 font-bold">✓ ตั้งค่าแล้ว</span>}
            </label>
            <input
              type="password"
              value={channelAccessToken}
              onChange={(e) => setChannelAccessToken(e.target.value)}
              placeholder="••••••••••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Token จะถูกเก็บอย่างปลอดภัยบนฝั่ง Server เท่านั้น และไม่มีการเปิดเผยต่อ Client หรือ LocalStorage
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Default Test LINE User ID (ค่าเริ่มต้นสำหรับ Send Test)
            </label>
            <input
              type="text"
              value={defaultTestUserId}
              onChange={(e) => setDefaultTestUserId(e.target.value)}
              placeholder="U1234567890abcdef1234567890abcdef"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] outline-none"
            />
          </div>
        </div>

        {/* 3. Google Gemini API Configuration for AI Assistant */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sparkles className="h-5 w-5 text-[#06C755]" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Google Gemini API Key (สำหรับ AI Content Assistant)
              </h3>
              <p className="text-xs text-slate-500">
                ใช้สำหรับแปลงข้อความแคมเปญของผู้ใช้เป็น Structured Data อัตโนมัติ
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>Gemini API Key</span>
              {hasGeminiKey && <span className="text-[10px] text-emerald-600 font-bold">✓ ตั้งค่าแล้ว</span>}
            </label>
            <input
              type="password"
              value={geminiApiKey}
              onChange={(e) => setGeminiApiKey(e.target.value)}
              placeholder="AIzaSy••••••••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs font-mono focus:border-[#06C755] outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              (หากไม่ได้ระบุคีย์ ระบบจะใช้ Smart Rule-based Content Parser ที่มีในตัวอัตโนมัติ)
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between">
          <div>
            {saveBanner && (
              <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-in fade-in">
                ✓ บันทึกการตั้งค่าระบบสำเร็จเรียบร้อยแล้ว
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-green-100 disabled:opacity-50 transition-all"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>บันทึกการตั้งค่า</span>
          </button>
        </div>
      </form>
    </div>
  );
}
