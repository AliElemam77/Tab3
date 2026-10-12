import React from 'react';
import { LogOut, Sun, Moon, Radio, ShieldCheck } from 'lucide-react';
import type { ClientProject } from '../types';

interface NavbarProps {
  client: ClientProject | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onLogout: () => void;
  isLive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  client,
  theme,
  onToggleTheme,
  onLogout,
  isLive
}) => {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'var(--bg-glass)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px'
    }}>
      {/* Brand & Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--primary-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '22px',
          fontWeight: 900
        }}>
          ت
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{
              fontSize: '19px',
              fontWeight: 800,
              letterSpacing: '-0.3px',
              margin: 0,
              color: 'var(--text-main)',
              lineHeight: 1.2
            }}>
              تابع <span style={{ color: 'var(--primary)', fontSize: '14px', fontWeight: 600 }}>Tab3</span>
            </h1>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11px',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--success)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontWeight: 600
            }}>
              <Radio size={12} className={isLive ? 'animate-pulse' : ''} />
              {isLive ? 'مزامنة لحظية' : 'سحابي متصل'}
            </span>
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
            بوابة متابعة المشاريع والمهام للعملاء
          </p>
        </div>
      </div>

      {/* User and Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {client && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)'
          }}>
            <ShieldCheck size={16} color="var(--primary)" />
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '12.5px', fontWeight: 700, display: 'block', color: 'var(--text-main)' }}>
                {client.name}
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-dim)', display: 'block' }}>
                {client.cat || 'عميل معتمد'}
              </span>
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'التحويل للوضع النهاري' : 'التحويل للوضع الليلي'}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-main)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
        </button>

        {/* Logout */}
        {client && (
          <button
            onClick={onLogout}
            title="تسجيل الخروج"
            style={{
              height: '38px',
              padding: '0 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--danger-soft)',
              color: 'var(--danger)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              fontWeight: 600
            }}
          >
            <LogOut size={16} />
            <span>خروج</span>
          </button>
        )}
      </div>
    </header>
  );
};
