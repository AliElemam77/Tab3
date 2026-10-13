import React, { useState } from 'react';
import {
  Code2,
  Palette,
  Search,
  Target,
  Share2,
  Clock,
  UserCheck,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import type { DepartmentKey, DepartmentTask } from '../types';
import { DEPT_META } from '../types';

interface TaskCardProps {
  deptKey: DepartmentKey;
  legacyStatus?: number;
  taskDetails?: DepartmentTask;
  index?: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  deptKey,
  legacyStatus = 0,
  taskDetails,
  index = 0
}) => {
  const [expanded, setExpanded] = useState(false);
  const meta = DEPT_META[deptKey];
  const toStatus = (v: unknown): number | null => {
    if (v === undefined || v === null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? Math.min(2, Math.max(0, Math.round(n))) : null;
  };
  // deptDetails is the source of truth — legacy column may be stale/0.
  const status = (toStatus(taskDetails?.status)
    ?? toStatus(legacyStatus)
    ?? 0) as 0 | 1 | 2;

  const assignee = taskDetails?.assignee || 'فريق ' + meta.shortName;
  const deadline = taskDetails?.deadline || 'يُحدد لاحقاً';
  const note = taskDetails?.note || 'جاري تجهيز متطلبات هذه المرحلة والتنسيق مع الفريق المختص.';

  const cls = status === 2 ? 'done' : status === 1 ? 'work' : 'wait';

  const getIcon = () => {
    switch (deptKey) {
      case 'dev': return <Code2 size={20} />;
      case 'ui': return <Palette size={20} />;
      case 'seo': return <Search size={20} />;
      case 'media': return <Target size={20} />;
      case 'social': return <Share2 size={20} />;
    }
  };

  const LONG = 140;
  const isLong = note.length > LONG;
  const shown = expanded || !isLong ? note : note.slice(0, LONG).trim() + '…';

  const renderNote = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        let label = 'فتح الرابط';
        try { label = new URL(part).hostname.replace('www.', ''); } catch {}
        return (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="link-chip">
            <ExternalLink size={12} />
            <span>{label}</span>
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <article className={`card card-hover task task-item ${cls}`}>
      <div className="task-accent" />
      <div className="task-body">
        <span className="task-ghost" aria-hidden="true">{meta.step || `0${index + 1}`}</span>
        <div className="task-head-row">
          <span className="task-step">مرحلة {meta.step || `0${index + 1}`}</span>
          <span className="task-cat">{meta.shortName}</span>
        </div>
        <div className="task-head">
          <div className="task-title">
            <div className="task-ic">{getIcon()}</div>
            <div style={{ minWidth: 0 }}>
              <h4>{meta.name}</h4>
              <p>{meta.description}</p>
            </div>
          </div>
          {status === 2 ? (
            <span className="status done"><CheckCircle2 size={13} /> مكتمل</span>
          ) : status === 1 ? (
            <span className="status work"><i className="dot" /> قيد التنفيذ</span>
          ) : (
            <span className="status wait"><Clock size={13} /> بانتظار البدء</span>
          )}
        </div>

        <div className="task-info">
          <div className="task-info-item">
            <div className="mini"><UserCheck size={15} /></div>
            <div style={{ minWidth: 0 }}><small>المسؤول</small><b>{assignee}</b></div>
          </div>
          <div className="task-info-item">
            <div className="mini"><Calendar size={15} /></div>
            <div style={{ minWidth: 0 }}><small>التسليم المتوقع</small><b>{deadline}</b></div>
          </div>
        </div>

        <div className="task-note">
          <div className="t">
            <span>آخر تحديث من الفريق</span>
            {taskDetails?.handoffTo && (
              <span className="handoff">
                انتقل إلى: {DEPT_META[taskDetails.handoffTo as DepartmentKey]?.shortName || taskDetails.handoffTo}
              </span>
            )}
          </div>
          <div className="c">{renderNote(shown)}</div>
          {isLong && (
            <button className="more-btn" onClick={() => setExpanded(v => !v)}>
              {expanded ? 'عرض أقل' : 'عرض كامل التحديث'}
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
