import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { LogOut, Sun, Moon } from 'lucide-react';
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
  const barRef = useRef<HTMLElement>(null);
  const initial = (client?.name || 'ع').trim().charAt(0) || 'ع';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from(barRef.current, { y: -62, opacity: 0, duration: 0.6, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <header className="nav" ref={barRef}>
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-mark">ت</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="brand-name">تابع <small>Tab3</small></span>
              <span className={`live-dot ${isLive ? 'is-live' : ''}`}>
                <i />
                <span className="txt">{isLive ? 'مباشر' : 'متصل'}</span>
              </span>
            </div>
            <div className="brand-sub">متابعة المشاريع والمهام للعملاء</div>
          </div>
        </div>

        <div className="nav-actions">
          {client && (
            <div className="user-chip" title={client.name}>
              <div className="user-avatar">{initial}</div>
              <div style={{ minWidth: 0 }}>
                <b>{client.name}</b>
                <small>{client.cat || 'عميل معتمد'}</small>
              </div>
            </div>
          )}

          <button
            className="icon-btn"
            onClick={(e) => {
              if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                gsap.fromTo(e.currentTarget, { rotate: 0 }, { rotate: 180, duration: 0.45, ease: 'power2.out' });
              }
              onToggleTheme();
            }}
            title={theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
            aria-label="تبديل المظهر"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {client && (
            <button className="logout-btn" onClick={onLogout} title="تسجيل الخروج">
              <LogOut size={16} />
              <span>خروج</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
