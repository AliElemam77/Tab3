import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Layers, 
  MessageSquare, 
  PhoneCall, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  MapPin,
  Briefcase,
  Target
} from 'lucide-react';
import type { ClientProject, DepartmentKey } from '../types';
import { TaskCard } from './TaskCard';

interface DashboardViewProps {
  client: ClientProject;
}

const ALL_DEPTS: DepartmentKey[] = ['ui', 'dev', 'seo', 'media', 'social'];

export const DashboardView: React.FC<DashboardViewProps> = ({ client }) => {
  // Calculate overall progress percentage
  // 5 departments, each status: 0 => 0%, 1 => 50%, 2 => 100%
  const calculateProgress = () => {
    let totalScore = 0;
    ALL_DEPTS.forEach(d => {
      const st = (client[d] !== undefined && client[d] !== null)
        ? Number(client[d])
        : (client.deptDetails?.[d]?.status !== undefined ? Number(client.deptDetails[d]?.status) : 0);
      if (st === 2) totalScore += 2;
      else if (st === 1) totalScore += 1;
    });
    const maxScore = ALL_DEPTS.length * 2;
    return Math.round((totalScore / maxScore) * 100);
  };

  const progress = calculateProgress();

  // Completed & In progress counts
  let completedCount = 0;
  let inProgressCount = 0;
  ALL_DEPTS.forEach(d => {
    const st = (client[d] !== undefined && client[d] !== null)
      ? Number(client[d])
      : (client.deptDetails?.[d]?.status !== undefined ? Number(client.deptDetails[d]?.status) : 0);
    if (st === 2) completedCount++;
    else if (st === 1) inProgressCount++;
  });

  const waSupportUrl = client.wa
    ? (client.wa.startsWith('http') ? client.wa : `https://wa.me/${client.wa.replace(/[^0-9]/g, '')}`)
    : 'https://wa.me/';

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '24px 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* ================= HERO GREETING BANNER ================= */}
      <div className="glass-card" style={{
        padding: '28px 24px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(22, 32, 53, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-40px',
          left: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          {/* Client Details */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '3px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--primary-soft)',
                color: 'var(--primary)',
                fontSize: '12px',
                fontWeight: 700
              }}>
                <Sparkles size={13} />
                مشروع نشط وموثق
              </span>

              {client.city && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  color: 'var(--text-muted)'
                }}>
                  <MapPin size={13} />
                  {client.city}
                </span>
              )}
            </div>

            <h2 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px 0' }}>
              أهلاً بك، {client.name}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Briefcase size={15} color="var(--primary)" />
              <span>النشاط: {client.cat || 'مشروع متكامل'}</span>
              {client.by && <span>· مسؤول المتابعة: {client.by}</span>}
            </p>
          </div>

          {/* Progress Circular Display */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'var(--bg-surface-elevated)',
            padding: '14px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-medium)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block', fontWeight: 600 }}>
                نسبة إنجاز المشروع
              </span>
              <b style={{ fontSize: '28px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1.1 }}>
                {progress}%
              </b>
              <span style={{ fontSize: '11px', color: progress >= 100 ? 'var(--success)' : 'var(--text-muted)', display: 'block' }}>
                {progress >= 100 ? 'جاهز للتسليم بالكامل' : 'يسير العمل بنشاط'}
              </span>
            </div>

            {/* Circular Progress Meter */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: `conic-gradient(var(--primary) ${progress * 3.6}deg, var(--border-subtle) 0deg)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: 800,
                color: 'var(--text-main)'
              }}>
                <TrendingUp size={20} color="var(--primary)" />
              </div>
            </div>
          </div>
        </div>

        {/* Big Glow Progress Bar */}
        <div style={{ marginTop: '22px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '6px'
          }}>
            <span>مراحل التنفيذ والتسليم</span>
            <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{completedCount} من 5 مكتملة</span>
          </div>
          <div style={{
            height: '10px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            position: 'relative'
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: 'var(--primary-gradient)',
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: '0 0 12px var(--primary)'
            }} />
          </div>
        </div>
      </div>

      {/* ================= KEY MILESTONE KPI CARDS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {/* KPI 1: Completed */}
        <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--success-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--success)'
          }}>
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>المراحل المكتملة</span>
            <b style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)' }}>
              {completedCount} مراحل
            </b>
          </div>
        </div>

        {/* KPI 2: In Progress */}
        <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>قيد العمل النشط</span>
            <b style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)' }}>
              {inProgressCount} مراحل
            </b>
          </div>
        </div>

        {/* KPI 3: Total Scope */}
        <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Layers size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>إجمالي أقسام العمل</span>
            <b style={{ fontSize: '19px', fontWeight: 800, color: 'var(--text-main)' }}>
              5 أقسام رئيسية
            </b>
          </div>
        </div>

        {/* KPI 4: Expected Delivery */}
        <div className="glass-card" style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--warning-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--warning)'
          }}>
            <Calendar size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-dim)', display: 'block' }}>موعد التسليم المتوقع الإجمالي</span>
            <b style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-main)' }}>
              {client.expectedDelivery || 'حسب جدول المراحل'}
            </b>
          </div>
        </div>
      </div>

      {/* ================= TEAM NOTE / CLIENT MESSAGE BANNER ================= */}
      {client.clientNote && (
        <div className="glass-card" style={{
          padding: '18px 22px',
          background: 'linear-gradient(90deg, rgba(59, 130, 246, 0.08) 0%, rgba(99, 102, 241, 0.05) 100%)',
          border: '1px solid var(--border-glow)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '14px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            flexShrink: 0
          }}>
            <MessageSquare size={20} />
          </div>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
              رسالة وتحديث فريق العمل لمشروعكم:
            </span>
            <p style={{ fontSize: '14px', color: 'var(--text-main)', margin: 0, lineHeight: 1.6 }}>
              "{client.clientNote}"
            </p>
          </div>
        </div>
      )}

      {/* ================= DEPARTMENT TASKS GRID ================= */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <Target size={18} color="var(--primary)" />
            <span>تفاصيل مراحل المشروع وأقسام التنفيذ</span>
          </h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            تحديث لحظي ومباشر من فريق العمل
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
          {ALL_DEPTS.map(deptKey => (
            <TaskCard
              key={deptKey}
              deptKey={deptKey}
              legacyStatus={client[deptKey]}
              taskDetails={client.deptDetails?.[deptKey]}
            />
          ))}
        </div>
      </div>

      {/* ================= SUPPORT & WHATSAPP CTA ================= */}
      <div className="glass-card" style={{
        padding: '24px',
        textAlign: 'center',
        background: 'var(--bg-surface-elevated)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '14px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: 'var(--wa-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          boxShadow: '0 0 20px rgba(37, 211, 102, 0.35)'
        }}>
          <PhoneCall size={24} />
        </div>
        <div>
          <h4 style={{ fontSize: '17px', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-main)' }}>
            هل لديك أي استفسار أو طلب إضافة في مشروعك؟
          </h4>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            فريق الدعم ومدير حسابك متاحين للرد والمتابعة معك عبر واتساب.
          </p>
        </div>
        <a
          href={waSupportUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 26px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--wa-color)',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 800,
            boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
            transition: 'var(--transition)'
          }}
        >
          <span>تواصل مع مدير مشروعك على واتساب</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};
