'use client';

import React, { useEffect, useState } from 'react';
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
  Sparkles,
  PlusCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const [settings, setSettings] = useState<{
    environmentMode: string;
    isConnected: boolean;
  }>({
    environmentMode: 'development',
    isConnected: false,
  });

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.environmentMode) {
          setSettings({
            environmentMode: data.environmentMode,
            isConnected: data.isConnected,
          });
        }
      })
      .catch(() => {});
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/broadcasts', label: 'Broadcasts', icon: Layers },
    { href: '/templates', label: 'Templates', icon: LayoutTemplate },
    { href: '/imagemap', label: 'Imagemap Studio', icon: ImageIcon },
    { href: '/media', label: 'Media Library', icon: FolderOpen },
    { href: '/settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-slate-900 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#06C755] text-white shadow-sm shadow-green-200 group-hover:scale-105 transition-transform">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="text-base font-extrabold tracking-tight text-slate-900">LINE OA</span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">FLEX</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">Broadcast Manager</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
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
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-slate-100 text-slate-900 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  )}
                >
                  <Icon className={cn('h-4 w-4', isActive ? 'text-[#06C755]' : 'text-slate-400')} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side Status & Actions */}
        <div className="flex items-center gap-3">
          {/* Environment Safety Badge */}
          <div
            className={cn(
              'hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
              settings.environmentMode === 'production'
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-blue-50 text-blue-700 border-blue-200'
            )}
            title={
              settings.environmentMode === 'production'
                ? 'Production Mode: Broadcasts will be sent to all followers'
                : 'Development Mode: Broadcasts are safe/disabled, Send Test only'
            }
          >
            {settings.environmentMode === 'production' ? (
              <>
                <ShieldAlert className="h-3.5 w-3.5 text-amber-600" />
                <span>PROD</span>
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>DEV MODE</span>
              </>
            )}
          </div>

          {/* New Broadcast CTA Button */}
          <Link
            href="/broadcasts/new"
            className="flex items-center gap-2 rounded-xl bg-[#06C755] hover:bg-[#05B04B] px-4 py-2 text-sm font-semibold text-white shadow-xs shadow-green-200 transition-all hover:shadow-md hover:shadow-green-100 active:scale-98"
          >
            <PlusCircle className="h-4 w-4" />
            <span>สร้าง Broadcast</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
