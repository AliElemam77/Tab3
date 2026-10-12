import React from 'react';
import { 
  Code2, 
  Palette, 
  Search, 
  Target, 
  Share2, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  ExternalLink
} from 'lucide-react';
import type { DepartmentKey, DepartmentTask } from '../types';
import { DEPT_META } from '../types';

interface TaskCardProps {
  deptKey: DepartmentKey;
  legacyStatus?: number;
  taskDetails?: DepartmentTask;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  deptKey,
  legacyStatus = 0,
  taskDetails
}) => {
  const meta = DEPT_META[deptKey];
  // Department status: take legacyStatus (set by the dashboard column dropdown) as primary
  const status = (legacyStatus !== undefined && legacyStatus !== null)
    ? (Number(legacyStatus) as 0 | 1 | 2)
    : (taskDetails?.status !== undefined ? (Number(taskDetails.status) as 0 | 1 | 2) : 0);
  const assignee = taskDetails?.assignee || 'فريق ' + meta.shortName;
  const deadline = taskDetails?.deadline || 'يحدد لاحقاً';
  const note = taskDetails?.note || 'جاري إعداد متطلبات هذه المرحلة والتنسيق مع الفريق.';

  // Department Icon
  const getIcon = () => {
    switch (deptKey) {
      case 'dev': return <Code2 size={22} color={meta.color} />;
      case 'ui': return <Palette size={22} color={meta.color} />;
      case 'seo': return <Search size={22} color={meta.color} />;
      case 'media': return <Target size={22} color={meta.color} />;
      case 'social': return <Share2 size={22} color={meta.color} />;
    }
  };

  // Status Styling
  const getStatusBadge = () => {
    if (status === 2) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(16, 185, 129, 0.15)',
          color: 'var(--success)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <CheckCircle2 size={14} />
          <span>تم الانتهاء والتسليم</span>
        </span>
      );
    }
    if (status === 1) {
      return (
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(59, 130, 246, 0.15)',
          color: 'var(--primary)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: 'var(--primary)',
            boxShadow: '0 0 8px var(--primary)',
            display: 'inline-block'
          }} />
          <span>جارٍ التنفيذ نشطاً</span>
        </span>
      );
    }
    return (
      <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        background: 'rgba(148, 163, 184, 0.15)',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-subtle)',
        fontSize: '12px',
        fontWeight: 600
      }}>
        <Clock size={14} />
        <span>قيد الانتظار</span>
      </span>
    );
  };

  return (
    <div className="glass-card" style={{
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Accent line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: status === 2 ? 'var(--success)' : status === 1 ? meta.color : 'var(--border-subtle)'
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: meta.bgSoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: `1px solid ${meta.color}33`,
            flexShrink: 0
          }}>
            {getIcon()}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: 'var(--text-main)' }}>
              {meta.name}
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
              {meta.description}
            </p>
          </div>
        </div>
        <div>
          {getStatusBadge()}
        </div>
      </div>

      {/* Team & Deadline Info Box */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 14px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {/* With Who */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: 'var(--primary-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary)'
          }}>
            <UserCheck size={16} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block' }}>المسؤول (مع مين؟)</span>
            <b style={{ fontSize: '13px', color: 'var(--text-main)' }}>{assignee}</b>
          </div>
        </div>

        {/* When / Deadline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: 'var(--radius-full)',
            background: status === 2 ? 'var(--success-soft)' : 'var(--warning-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: status === 2 ? 'var(--success)' : 'var(--warning)'
          }}>
            <Calendar size={16} />
          </div>
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-dim)', display: 'block' }}>موعد التسليم المتوقع</span>
            <b style={{ fontSize: '13px', color: 'var(--text-main)' }}>{deadline}</b>
          </div>
        </div>
      </div>

      {/* Note from team */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        borderLeft: `3px solid ${status === 2 ? 'var(--success)' : meta.color}`,
        padding: '12px 14px',
        borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px'
      }}>
        <Sparkles size={16} color={meta.color} style={{ marginTop: '3px', flexShrink: 0 }} />
        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px', marginBottom: '4px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'var(--text-muted)' }}>
              تحديث المرحلة وملاحظة التنفيذ:
            </span>
            {taskDetails?.handoffTo && (
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: 'var(--primary)',
                background: 'rgba(59, 130, 246, 0.12)',
                padding: '2px 8px',
                borderRadius: '4px',
                border: '1px solid rgba(59, 130, 246, 0.25)'
              }}>
                <span>تم تسليم وتوجيه المرحلة إلى:</span>
                <b>{DEPT_META[taskDetails.handoffTo as DepartmentKey]?.name || taskDetails.handoffTo}</b>
              </span>
            )}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text-main)', margin: 0, lineHeight: 1.6, wordBreak: 'break-word' }}>
            {(() => {
              const urlRegex = /(https?:\/\/[^\s]+)/g;
              const parts = note.split(urlRegex);
              return parts.map((part, index) => {
                if (part.match(urlRegex)) {
                  let label = 'رابط الملف / العمل';
                  try {
                    const u = new URL(part);
                    label = u.hostname.replace('www.', '');
                  } catch {}
                  return (
                    <a
                      key={index}
                      href={part}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        margin: '2px 4px',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(59, 130, 246, 0.15)',
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontSize: '12px',
                        fontWeight: 700,
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        direction: 'ltr'
                      }}
                    >
                      <ExternalLink size={12} />
                      <span>{label}</span>
                    </a>
                  );
                }
                return <span key={index}>{part}</span>;
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};
