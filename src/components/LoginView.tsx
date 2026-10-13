import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Lock, User, ArrowLeft, Eye, EyeOff, ShieldCheck, CircleAlert, Headset, Fingerprint } from 'lucide-react';

interface LoginViewProps {
  onLogin: (username: string, pass: string) => Promise<boolean>;
  onDemoLogin?: () => void;
  initialUsername?: string;
  initialPassword?: string;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLogin,
  initialUsername = '',
  initialPassword = ''
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const errRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.login-grid', { y: 28, opacity: 0, duration: 0.7 })
        .from('.login-side > *', { x: 24, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.35')
        .from('.login-step', { x: 18, opacity: 0, duration: 0.45, stagger: 0.09 }, '-=0.3')
        .from('.login-anim', { y: 16, opacity: 0, duration: 0.5, stagger: 0.07 }, '-=0.5');
      gsap.to('.btn-primary .shine', {
        x: 320, duration: 2.2, repeat: -1, ease: 'power1.inOut', repeatDelay: 1.4
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (errorMsg && errRef.current && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.fromTo(errRef.current, { x: 0 }, { keyframes: [{ x: -7 }, { x: 7 }, { x: -4 }, { x: 0 }], duration: 0.35, ease: 'power1.out' });
    }
  }, [errorMsg]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMsg('يرجى إدخال اسم المستخدم وكلمة المرور للمتابعة.');
      return;
    }
    setLoading(true);
    setErrorMsg('');
    const success = await onLogin(username.trim(), password);
    setLoading(false);
    if (!success) {
      setErrorMsg('تعذر الدخول. تأكد من البيانات أو تواصل مع مدير مشروعك لتفعيل الحساب.');
    }
  };

  return (
    <div className="login-wrap" ref={rootRef}>
      <div className="login-grid">
        <div className="login-side">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fafafa', color: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22 }}>ت</div>
            <b style={{ fontSize: 16 }}>تابع — بوابة العميل</b>
          </div>
          <h2>مشروعك أمامك.<br />بالأرقام، أولاً بأول.</h2>
          <p>حالة كل قسم، المسؤول عنه، موعد التسليم، وملاحظات الفريق — بدون اتصالات متكررة.</p>
          <div className="login-steps">
            <div className="login-step"><span className="n">1</span><div><b>سجل الدخول</b><small>بالبيانات المرسلة لك من فريق العمل</small></div></div>
            <div className="login-step"><span className="n">2</span><div><b>راجع نسب الإنجاز</b><small>5 أقسام: برمجة، تصميم، SEO، إعلانات، سوشيال</small></div></div>
            <div className="login-step"><span className="n">3</span><div><b>تواصل عند الحاجة</b><small>زر مباشر مع مدير مشروعك</small></div></div>
          </div>
        </div>

        <div className="login-form-box">
          <span className="login-kicker login-anim"><Fingerprint size={14} /> بوابة عملاء — دخول آمن</span>
          <h1 className="login-anim">تسجيل الدخول لمشروعي</h1>
          <p className="login-anim">أدخل البيانات المرسلة إليك من فريق العمل لعرض حالة مشروعك.</p>

          {errorMsg && (
            <div className="alert-error login-anim" role="alert" ref={errRef}>
              <CircleAlert size={17} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="field login-anim">
              <label htmlFor="login-u">اسم المستخدم أو رقم الجوال</label>
              <div className="input-wrap">
                <input
                  id="login-u"
                  type="text"
                  autoComplete="username"
                  placeholder="مثال: 0501234567"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <User size={17} className="icon" color="var(--text-3)" />
              </div>
            </div>

            <div className="field login-anim">
              <label htmlFor="login-p">كلمة المرور</label>
              <div className="input-wrap">
                <input
                  id="login-p"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Lock size={17} className="icon" color="var(--text-3)" />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="login-anim">
              <button type="submit" className="btn-primary" disabled={loading}>
                <span className="shine" />
                <span>{loading ? 'جاري التحقق…' : 'دخول إلى مشروعي'}</span>
                {!loading && <ArrowLeft size={17} />}
              </button>
            </div>
          </form>

          <div className="login-foot login-anim">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={14} /> اتصال آمن ومشفر
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <Headset size={14} /> نسيت بياناتك؟ تواصل مع مدير مشروعك
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
