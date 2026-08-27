'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Send,
  LayoutDashboard,
  Layers,
  LayoutTemplate,
  Image as ImageIcon,
  FolderOpen,
  Settings as SettingsIcon,
  ShieldCheck,
  ShieldAlert,
  PlusCircle,
  ChevronDown,
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEnvironmentMode } from '@/context/SettingsContext';

export function Navbar() {
  const pathname = usePathname();
  const { environmentMode, setMode, isLoading: isContextLoading } = useEnvironmentMode();
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleSwitchMode = async (newMode: 'development' | 'production') => {
    if (newMode === environmentMode) {
      setIsModeDropdownOpen(false);
      return;
    }

    if (newMode === 'production') {
      const confirmProd = window.confirm(
        '⚠️ คุณต้องการเปลี่ยนเป็น PRODUCTION MODE (โหมดส่งจริง) ใช่หรือไม่?\n\nเมื่ออยู่ในโหมดนี้ การกดยิง Broadcast จะส่งข้อความถึงผู้ติดตามทุกคนจริง'
      );
      if (!confirmProd) return;
    }

    setIsSwitching(true);
    await setMode(newMode);
    setIsSwitching(false);
    setIsModeDropdownOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/broadcasts', label: 'Broadcasts', icon: Layers },
    { href: '/templates', label: 'Templates', icon: LayoutTemplate },
    { href: '/imagemap', label: 'Imagemap Studio', icon: ImageIcon },
    { href: '/media', label: 'Media Library', icon: FolderOpen },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Main Nav */}
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#06C755] text-white shadow-xs shadow-green-300 group-hover:scale-105 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="text-sm font-black tracking-tight text-slate-900">LINE OA</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 tracking-wide">
                  FLEX
                </span>
              </div>
              <span className="text-[10px] font-semibold text-slate-400">Broadcast Manager</span>
            </div>
          </Link>

          {/* Clean Unified Navigation Bar */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5',
                      isActive ? 'text-[#06C755]' : 'text-slate-400'
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Interactive Environment Mode Quick Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
              disabled={isSwitching || isContextLoading}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-2xs transition-all cursor-pointer select-none',
                environmentMode === 'production'
                  ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 ring-2 ring-amber-400/30'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200'
              )}
              title="คลิกเพื่อสลับโหมดความปลอดภัย (DEV / PROD)"
            >
              {isSwitching ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : environmentMode === 'production' ? (
                <>
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>⚡ PROD MODE</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                  <span>🛡️ DEV MODE</span>
                </>
              )}
              <ChevronDown className="h-3 w-3 opacity-60 ml-0.5" />
            </button>

            {/* Mode Dropdown Popover */}
            {isModeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white p-2.5 shadow-xl border border-slate-200 z-50 animate-in fade-in zoom-in-95 space-y-1.5">
                <div className="px-2 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  สลับโหมดการทำงาน
                </div>

                {/* Dev Option */}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('development')}
                  className={cn(
                    'w-full flex items-start gap-2 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer',
                    environmentMode === 'development'
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>DEVELOPMENT</span>
                      {environmentMode === 'development' && (
                        <Check className="h-3.5 w-3.5 text-blue-600" />
                      )}
                    </div>
                    <p className="text-[10px] font-normal text-slate-500 leading-tight mt-0.5">
                      โหมดปลอดภัย: ทดสอบยิงเข้า User ID ส่วนตัวเท่านั้น
                    </p>
                  </div>
                </button>

                {/* Prod Option */}
                <button
                  type="button"
                  onClick={() => handleSwitchMode('production')}
                  className={cn(
                    'w-full flex items-start gap-2 p-2 rounded-xl text-left text-xs transition-colors cursor-pointer',
                    environmentMode === 'production'
                      ? 'bg-amber-50 text-amber-900 font-bold border border-amber-300'
                      : 'hover:bg-slate-50 text-slate-700'
                  )}
                >
                  <ShieldAlert className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span>PRODUCTION</span>
                      {environmentMode === 'production' && (
                        <Check className="h-3.5 w-3.5 text-amber-600" />
                      )}
                    </div>
                    <p className="text-[10px] font-normal text-slate-500 leading-tight mt-0.5">
                      โหมดส่งจริง: ยิง Broadcast ถึงผู้ติดตามทั้งหมด
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* New Broadcast CTA Button */}
          <Link
            href="/broadcasts/new"
            className="flex items-center gap-1.5 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-3.5 py-2 text-xs font-bold text-white shadow-xs shadow-green-200 transition-all hover:shadow-md hover:shadow-green-100 active:scale-98"
          >
            <PlusCircle className="h-4 w-4" />
            <span>สร้าง Broadcast</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
