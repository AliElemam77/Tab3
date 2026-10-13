export type DepartmentKey = 'dev' | 'ui' | 'seo' | 'media' | 'social';

export type TaskStatus = 0 | 1 | 2; // 0: لسه / انتظار, 1: شغال / قيد التنفيذ, 2: خلص / مكتمل

export interface DepartmentTask {
  status: TaskStatus;
  assignee?: string; // مين اللي شغال عليه (مع مين)
  assigneeRole?: string; // مثلاً: مطور برمجيات، ميديا باير
  deadline?: string; // موعد التسليم المتوقع
  note?: string; // ملاحظة المرحلة للعميل
  handoffTo?: string; // توجيه لقسم آخر
  handoffAt?: number;
  handoffBy?: string;
  updatedAt?: number;
}

export interface ClientProject {
  id: string;
  name: string; // اسم العميل أو الشركة
  cat?: string; // نوع النشاط
  city?: string;
  phone?: string;
  wa?: string;
  site?: string;
  ig?: string;
  plat?: string;
  by?: string; // مسؤول المبيعات الذي سجل العميل
  at?: number; // تاريخ البدء

  // بيانات الدخول لمنصة تابع
  portalActive: boolean;
  portalUsername: string;
  portalPassword?: string;

  // الحالات الكلاسيكية (0, 1, 2)
  seo?: TaskStatus;
  media?: TaskStatus;
  social?: TaskStatus;
  dev?: TaskStatus;
  ui?: TaskStatus;

  // تفاصيل المهام والتسليمات المحدثة من الداشبورد
  deptDetails?: {
    dev?: DepartmentTask;
    ui?: DepartmentTask;
    seo?: DepartmentTask;
    media?: DepartmentTask;
    social?: DepartmentTask;
  };

  // الملاحظات وموعد التسليم الإجمالي
  clientNote?: string;
  expectedDelivery?: string;
  updatedAt?: number;
}

export const DEPT_META: Record<DepartmentKey, {
  name: string;
  shortName: string;
  defaultRole: string;
  iconName: string;
  color: string;
  bgSoft: string;
  description: string;
  step: string;
}> = {
  dev: {
    name: 'البرمجة والتطوير',
    shortName: 'برمجة',
    defaultRole: 'مطور برمجيات وتطبيقات',
    iconName: 'code',
    color: 'var(--text)',
    bgSoft: 'var(--bg-muted)',
    description: 'تطوير هيكل الموقع/المتجر، برمجة الوظائف، وربط بوابات الدفع والشحن',
    step: '01'
  },
  ui: {
    name: 'تصميم الواجهات وتجربة المستخدم (UI/UX)',
    shortName: 'تصميم UI',
    defaultRole: 'مصمم واجهات منتجات',
    iconName: 'palette',
    color: 'var(--text)',
    bgSoft: 'var(--bg-muted)',
    description: 'رسم واجهات المستخدم، تصميم الهوية البصرية، وتجربة التسوق والشراء',
    step: '02'
  },
  seo: {
    name: 'تهيئة محركات البحث (SEO)',
    shortName: 'SEO',
    defaultRole: 'أخصائي تحسين محركات البحث',
    iconName: 'search',
    color: 'var(--text)',
    bgSoft: 'var(--bg-muted)',
    description: 'تحسين سرعة الموقع، فحص الكلمات المفتاحية، والظهور في نتائج قوقل الأولى',
    step: '03'
  },
  media: {
    name: 'الحملات الإعلانية والميديا باير',
    shortName: 'ميديا',
    defaultRole: 'مدير حملات إعلانية',
    iconName: 'target',
    color: 'var(--text)',
    bgSoft: 'var(--bg-muted)',
    description: 'إطلاق وتوجيه الإعلانات الممولة على سناب، تيك توك، ميتا، وجوجل لزيادة المبيعات',
    step: '04'
  },
  social: {
    name: 'إدارة وتفعيل منصات السوشيال ميديا',
    shortName: 'سوشيال',
    defaultRole: 'أخصائي إدارة مجتمعات ومحتوى',
    iconName: 'share-2',
    color: 'var(--text)',
    bgSoft: 'var(--bg-muted)',
    description: 'صناعة المحتوى، جدولة المنشورات التفاعلية، والتواصل مع الجمهور المستهدف',
    step: '05'
  }
};
