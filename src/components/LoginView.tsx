import React, { useState } from 'react';
import { Lock, User, ArrowLeft, Sparkles, Shield } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string, pass: string) => Promise<boolean>;
  onDemoLogin: () => void;
  initialUsername?: string;
  initialPassword?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  onDemoLogin,
  initialUsername = '',
  initialPassword = ''
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const success = await onLogin(username, password);
    setLoading(false);
    if (!success) {
      setErrorMsg('اسم المستخدم أو كلمة المرور غير صحيحة، أو الحساب غير مفعل بعد.');
    }
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 75px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(circle at 50% 20%, rgba(59, 130, 246, 0.12) 0%, transparent 60%)'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '460px',
        width: '100%',
        padding: '36px 30px',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Glow pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          background: 'var(--primary-soft)',
          color: 'var(--primary)',
          border: '1px solid var(--border-glow)',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '18px'
        }}>
          <Sparkles size={14} />
          <span>بوابة العميل الحصرية</span>
        </div>

        {/* Brand Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--primary-gradient)',
          margin: '0 auto 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-glow)',
          fontSize: '32px',
          fontWeight: 900,
          color: '#fff'
        }}>
          ت
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px', color: 'var(--text-main)' }}>
          مرحباً بك في <span style={{ color: 'var(--primary)' }}>تابع</span>
        </h2>
        <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
          بوابتك لمتابعة مراحل مشروعك، نسب الإنجاز، ومسؤولي التنفيذ لحظة بلحظة.
        </p>

        {errorMsg && (
          <div style={{
            background: 'var(--danger-soft)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
            fontSize: '12.5px',
            marginBottom: '16px',
            textAlign: 'right'
          }}>
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'right' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              اسم المستخدم أو رقم الهاتف:
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="مثال: 0501234567"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  direction: 'ltr',
                  textAlign: 'right'
                }}
              />
              <User size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>
              كلمة المرور:
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type="password"
                placeholder="أدخل كلمة المرور..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 38px 12px 14px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-main)',
                  fontSize: '14px',
                  direction: 'ltr',
                  textAlign: 'right'
                }}
              />
              <Lock size={18} color="var(--text-dim)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '13px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--primary-gradient)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: 'var(--shadow-glow)',
              opacity: loading ? 0.7 : 1
            }}
          >
            <span>{loading ? 'جاري التحقق...' : 'دخول إلى مشروعي'}</span>
            <ArrowLeft size={16} />
          </button>
        </form>

        {/* Demo Account Quick Access */}
        <div style={{
          marginTop: '22px',
          paddingTop: '18px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          <button
            type="button"
            onClick={onDemoLogin}
            style={{
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-surface-elevated)',
              border: '1px dashed var(--border-glow)',
              color: 'var(--primary)',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Shield size={16} />
            <span>تجربة سريعة بحساب تجريبي (Demo Account)</span>
          </button>

          <p style={{ fontSize: '11.5px', color: 'var(--text-dim)', margin: 0 }}>
            بيانات تجريبية جاهزة للمعاينة: 0501234567 / 123456
          </p>
        </div>
      </div>
    </div>
  );
};
