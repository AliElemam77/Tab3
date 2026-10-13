import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  MessageSquareText,
  ExternalLink,
  MapPin,
  ChevronLeft,
  Code2,
  Palette,
  Search,
  Target,
  Share2,
  Gauge
} from 'lucide-react';
import type { ClientProject, DepartmentKey } from '../types';
import { DEPT_META } from '../types';
import { TaskCard } from './TaskCard';

gsap.registerPlugin(ScrollTrigger);

interface DashboardViewProps {
  client: ClientProject;
}

const ALL_DEPTS: DepartmentKey[] = ['ui', 'dev', 'seo', 'media', 'social'];

const DEPT_ICON: Record<DepartmentKey, React.ReactNode> = {
  ui: <Palette size={15} />,
  dev: <Code2 size={15} />,
  seo: <Search size={15} />,
  media: <Target size={15} />,
  social: <Share2 size={15} />,
};

export const DashboardView: React.FC<DashboardViewProps> = ({ client }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  const toStatus = (v: unknown): number | null => {
    if (v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(2, Math.max(0, Math.round(n))) : null;
  };

  // deptDetails is the source of truth written by the dashboard —
  // legacy top-level columns may be missing/0, so check details FIRST.
  const getStatus = (d: DepartmentKey): number => {
    return toStatus(client.deptDetails?.[d]?.status)
      ?? toStatus(client[d])
      ?? 0;
  };

  const statuses = ALL_DEPTS.map((d) => ({ key: d, st: getStatus(d) }));
  let score = 0, done = 0, active = 0;
  statuses.forEach(({ st }) => {
    if (st === 2) { score += 2; done++; }
    else if (st === 1) { score += 1; active++; }
  });
  const waiting = ALL_DEPTS.length - done - active;
  const progress = Math.round((score / (ALL_DEPTS.length * 2)) * 100);

  const waSupportUrl = client.wa
    ? (client.wa.startsWith('http') ? client.wa : `https://wa.me/${client.wa.replace(/[^0-9]/g, '')}`)
    : 'https://wa.me/';

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.dash-head', { y: 22, opacity: 0, duration: 0.65, ease: 'power3.out' });
      gsap.from('.progress-card', { y: 24, opacity: 0, duration: 0.65, delay: 0.1, ease: 'power3.out' });
      gsap.from('.kpi', { y: 20, opacity: 0, duration: 0.55, stagger: 0.08, delay: 0.2, ease: 'power3.out' });
      gsap.from('.step', { y: 12, opacity: 0, duration: 0.45, stagger: 0.06, delay: 0.45, ease: 'power3.out' });
      gsap.from('.note-banner', { y: 16, opacity: 0, duration: 0.5, delay: 0.25, ease: 'power3.out' });

      const obj = { v: 0 };
      gsap.to(obj, {
        v: progress, duration: 1.4, delay: 0.25, ease: 'power2.out',
        onUpdate: () => { if (numRef.current) numRef.current.textContent = `${Math.round(obj.v)}%`; }
      });

      if (barRef.current) {
        gsap.fromTo(barRef.current, { scaleX: 0 }, { scaleX: progress / 100, duration: 1.3, delay: 0.3, ease: 'power3.out' });
      }
      if (ringRef.current) {
        gsap.fromTo(ringRef.current,
          { '--p': 0 },
          { '--p': progress, duration: 1.4, delay: 0.25, ease: 'power2.out' });
      }

      gsap.utils.toArray<HTMLElement>('.task-item').forEach((el) => {
        gsap.from(el, {
          y: 28, opacity: 0, duration: 0.6, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
      gsap.from('.support-card', {
        y: 24, opacity: 0, duration: 0.6, ease: 'power3.out',
        scrollTrigger: { trigger: '.support-card', start: 'top 92%', once: true }
      });
    }, rootRef);
    return () => ctx.revert();
  }, [client.id, progress]);

  return (
    <div className="page" ref={rootRef} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div className="dash-head">
        <div className="crumb"><span className="pill">مشروعي</span> <ChevronLeft size={13} /> نظرة عامة</div>
        <div className="page-head">
          <div style={{ minWidth: 0 }}>
            <h2>أهلاً {client.name} <span className="thin">— هذا ملخص مشروعك اليوم</span></h2>
            <div className="meta">
              {client.cat && <span className="meta-chip primary">{client.cat}</span>}
              {client.city && <span className="meta-chip"><MapPin size={13} /> {client.city}</span>}
              {client.by && <span className="meta-chip">مدير الحساب: {client.by}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <section className="card progress-card" aria-label="نسبة إنجاز المشروع">
        <div className="progress-pad">
          <div className="progress-head">
            <span className="card-eyebrow" style={{ flex: 1 }}><Gauge size={13} /> أداء المشروع</span>
            <span className={`phase-chip ${progress < 100 ? 'live' : ''}`}>
              <i />
              {progress >= 100 ? 'مكتمل — جاهز للتسليم' : active > 0 ? 'مرحلة تنفيذ نشطة' : 'بانتظار بدء التنفيذ'}
            </span>
          </div>
          <div className="progress-top">
            <div className="progress-num">
              <div className="ring" ref={ringRef} style={{ '--p': progress } as React.CSSProperties}>
                <div className="ring-inner" style={{ width: 60, height: 60, fontSize: 14 }}>
                  <b ref={numRef}>{progress}%</b>
                </div>
              </div>
              <div className="progress-label">
                <small>إنجاز المشروع الإجمالي</small>
                <strong>{progress}%</strong>
                <br />
                <span>
                  {progress >= 100 ? 'اكتمل المشروع — جاهز للتسليم' : done === 0 && active === 0 ? 'تم استلام طلبك وجارٍ بدء التنفيذ' : `مكتمل: ${done} · جارٍ: ${active} · منتظر: ${waiting}`}
                </span>
              </div>
            </div>
            <span className="meta-chip"><Calendar size={13} /> التسليم: {client.expectedDelivery || 'حسب جدول المراحل'}</span>
          </div>
          <div className="bar-row"><span>تقدم المراحل</span><span>{done} من 5 مكتملة</span></div>
          <div className="bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
            <div ref={barRef} style={{ width: '100%', transform: `scaleX(${progress / 100})` }} />
          </div>

          <div className="progress-divider" />
          <div className="stepper" aria-label="حالة الأقسام">
            {statuses.map(({ key, st }) => (
              <div key={key} className={`step ${st === 2 ? 'done' : st === 1 ? 'work' : ''}`} title={DEPT_META[key].name}>
                <span className="s-ic">{st === 2 ? <CheckCircle2 size={15} /> : st === 1 ? <Clock size={15} /> : DEPT_ICON[key]}</span>
                <small>{DEPT_META[key].shortName}</small>
              </div>
            ))}
          </div>
          <div className="legend">
            <span><i className="f" /> مكتمل</span>
            <span><i className="h" /> قيد التنفيذ</span>
            <span><i /> منتظر</span>
          </div>
        </div>
      </section>

      {/* KPIs */}
      <section className="kpi-grid">
        <div className="card card-hover kpi kpi-featured">
          <div className="kpi-top">
            <div className="kpi-ic"><CheckCircle2 size={20} /></div>
            <span className="kpi-delta">{done}/5 أقسام</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-value">{done} مراحل</div>
            <div className="kpi-label">مراحل مكتملة ومُسلّمة</div>
          </div>
          <div className="kpi-foot"><CheckCircle2 size={12} /> {done === 5 ? 'كل المراحل اكتملت' : `${5 - done} متبقية للإنجاز الكامل`}</div>
        </div>
        <div className="card card-hover kpi">
          <div className="kpi-top">
            <div className="kpi-ic"><Clock size={20} /></div>
            <span className={`kpi-delta ${active > 0 ? 'on' : ''}`}>{active > 0 ? 'نشط الآن' : 'لا نشاط'}</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-value">{active} مراحل</div>
            <div className="kpi-label">قيد التنفيذ حالياً</div>
          </div>
          <div className="kpi-foot"><Clock size={12} /> {active > 0 ? 'الفريق يعمل عليها الآن' : 'بانتظار بدء مرحلة جديدة'}</div>
        </div>
        <div className="card card-hover kpi">
          <div className="kpi-top">
            <div className="kpi-ic"><Layers size={20} /></div>
            <span className="kpi-delta">النطاق الكامل</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-value">5 أقسام</div>
            <div className="kpi-label">إجمالي أقسام العمل</div>
          </div>
          <div className="kpi-foot"><Layers size={12} /> برمجة · تصميم · SEO · إعلانات · سوشيال</div>
        </div>
        <div className="card card-hover kpi">
          <div className="kpi-top">
            <div className="kpi-ic"><Calendar size={20} /></div>
            <span className="kpi-delta">الموعد</span>
          </div>
          <div className="kpi-main">
            <div className="kpi-value" style={{ fontSize: 'clamp(16px, 4vw, 19px)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {client.expectedDelivery || 'حسب الخطة'}
            </div>
            <div className="kpi-label">التسليم المتوقع</div>
          </div>
          <div className="kpi-foot"><Calendar size={12} /> حسب جدول المراحل المعتمد</div>
        </div>
      </section>

      {client.clientNote && (
        <section className="card note-banner" aria-label="رسالة الفريق">
          <div className="ic"><MessageSquareText size={17} /></div>
          <div style={{ minWidth: 0 }}>
            <b className="t">تحديث من فريق العمل</b>
            <p>{client.clientNote}</p>
          </div>
        </section>
      )}

      <section>
        <div className="section-title">
          <h3>مراحل التنفيذ</h3>
          <span className="hint">{done}/5 مكتملة · تُحدّث مباشرة من الفريق</span>
        </div>
        <div className="tasks-list">
          {ALL_DEPTS.map((k, i) => (
            <TaskCard key={k} deptKey={k} legacyStatus={client[k]} taskDetails={client.deptDetails?.[k]} index={i} />
          ))}
        </div>
      </section>

      <section className="card support-card">
        <div className="support-ic">
          <MessageSquareText size={22} />
        </div>
        <div style={{ minWidth: 0, flex: '1 1 200px' }}>
          <div className="card-eyebrow" style={{ color: 'inherit', opacity: 0.7, marginBottom: 4 }}>الدعم المباشر</div>
          <h4>تحتاج تعديلاً أو لديك استفسار؟</h4>
          <p>تواصل مع مدير مشروعك مباشرة — نرد عادة خلال ساعات العمل.</p>
        </div>
        <a href={waSupportUrl} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <span>مراسلة عبر واتساب</span>
          <ExternalLink size={15} />
        </a>
      </section>

      <div className="mobile-cta">
        <a href={waSupportUrl} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <span>تواصل واتساب مع مدير مشروعك</span>
          <ExternalLink size={15} />
        </a>
      </div>
    </div>
  );
};
