import type { ClientProject } from '../types';
import { getSupabaseClient } from './supabase';

const STORAGE_KEY_PREFIX = 'sales_crm_';
const BROADCAST_CHANNEL = 'sales_crm_channel';

export function transformSupabaseClient(row: any): ClientProject {
  return {
    id: row.id,
    name: row.name || 'العميل',
    cat: row.cat || '',
    city: row.city || '',
    phone: row.phone || '',
    wa: row.wa || '',
    site: row.site || '',
    ig: row.ig || '',
    plat: row.plat || '',
    by: row.by || '',
    at: row.at || Date.now(),
    portalActive: row.portal_active ?? row.portalActive ?? true,
    portalUsername: row.portal_username ?? row.portalUsername ?? '',
    portalPassword: row.portal_password ?? row.portalPassword ?? '',
    seo: row.seo ?? 0,
    media: row.media ?? 0,
    social: row.social ?? 0,
    dev: row.dev ?? 0,
    ui: row.ui ?? 0,
    deptDetails: row.dept_details ?? row.deptDetails ?? {},
    clientNote: row.client_note ?? row.clientNote ?? '',
    expectedDelivery: row.expected_delivery ?? row.expectedDelivery ?? ''
  };
}

// Default Demo Client for instant testing
export const DEMO_CLIENT: ClientProject = {
  id: 'demo_1',
  name: 'مؤسسة الصفوة للتجارة',
  cat: 'تجارة إلكترونية وأزياء',
  city: 'الرياض',
  phone: '0501234567',
  wa: 'https://wa.me/966501234567',
  site: 'https://example.com',
  by: 'أحمد (سيلز)',
  at: Date.now() - 86400000 * 4,
  portalActive: true,
  portalUsername: '0501234567',
  portalPassword: '123456',
  seo: 1,
  media: 1,
  social: 2,
  dev: 1,
  ui: 2,
  deptDetails: {
    seo: {
      status: 1,
      assignee: 'أحمد كمال',
      assigneeRole: 'خبير تحسين محركات البحث',
      deadline: '25 أكتوبر 2026',
      note: 'جاري فحص الكلمات المفتاحية وضبط السيو الداخلي وتجهيز خريطة الموقع'
    },
    media: {
      status: 1,
      assignee: 'سارة المنصور',
      assigneeRole: 'مديرة حملات إعلانية',
      deadline: '20 أكتوبر 2026',
      note: 'تم إطلاق الحملات الإعلانية التجريبية واستهداف المهتمين بنجاح'
    },
    social: {
      status: 2,
      assignee: 'مريم العتيبي',
      assigneeRole: 'أخصائية إدارة محتوى',
      deadline: '15 أكتوبر 2026',
      note: 'تم اعتماد وتجهيز خطة المحتوى ونشر بوستات الهوية'
    },
    dev: {
      status: 1,
      assignee: 'م. عمر عادل',
      assigneeRole: 'كبير مطوري المتاجر',
      deadline: '28 أكتوبر 2026',
      note: 'برمجة وتخصيص المتجر، ربط بوابات تمارا وتابي والدفع الإلكتروني'
    },
    ui: {
      status: 2,
      assignee: 'ياسين الفهد',
      assigneeRole: 'مصمم واجهات وتجربة مستخدم',
      deadline: '12 أكتوبر 2026',
      note: 'تم تسليم كافة تصاميم الواجهات والبانرات الإعلانية بنجاح'
    }
  },
  clientNote: 'يسير العمل على مشروعكم بشكل ممتاز ومتقدم عن الجدول الزمني المخطط له!',
  expectedDelivery: '30 أكتوبر 2026'
};

class ClientDataService {
  private bc: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.bc = new BroadcastChannel(BROADCAST_CHANNEL);
    }
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('crm_firebase_config');
      }
    } catch {}
  }

  public getIsCloud(): boolean {
    return !!getSupabaseClient();
  }

  // Get local clients map from localStorage
  private getLocalClients(): Record<string, any> {
    try {
      if (typeof localStorage === 'undefined') return {};
      const raw = localStorage.getItem(STORAGE_KEY_PREFIX + 'clients');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  // Authenticate client by username & password
  public async authenticate(username: string, password: string): Promise<ClientProject | null> {
    const cleanUser = username.trim().toLowerCase();
    const cleanPass = password.trim();

    // 0. Check Supabase Cloud if configured
    const sb = getSupabaseClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('clients').select('*');
        if (!error && data && data.length > 0) {
          for (const row of data) {
            const u = (row.portal_username || row.portalUsername || row.phone || '').toString().trim().toLowerCase();
            const p = (row.portal_password || row.portalPassword || '').toString().trim();
            if (u === cleanUser && p === cleanPass) {
              const clientObj = transformSupabaseClient(row);
              try {
                const local = this.getLocalClients();
                local[clientObj.id] = clientObj;
                localStorage.setItem(STORAGE_KEY_PREFIX + 'clients', JSON.stringify(local));
              } catch {}
              return clientObj;
            }
          }
        }
      } catch (err) {
        console.warn('Error querying Supabase for client auth:', err);
      }
    }

    // 1. Check Demo credentials
    if (
      (cleanUser === DEMO_CLIENT.portalUsername || cleanUser === 'demo' || cleanUser === '0501234567') &&
      (cleanPass === DEMO_CLIENT.portalPassword || cleanPass === '123456' || cleanPass === 'demo')
    ) {
      const local = this.getLocalClients();
      if (local['demo_1']) {
        return { id: 'demo_1', ...local['demo_1'] };
      }
      return DEMO_CLIENT;
    }

    // 2. Fetch from shared bridge endpoint (Dashboard port 3000)
    try {
      const resp = await fetch('http://localhost:3000/api/storage/clients', {
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(2500)
      });
      if (resp.ok) {
        const remote = await resp.json();
        if (remote && typeof remote === 'object') {
          try {
            localStorage.setItem(STORAGE_KEY_PREFIX + 'clients', JSON.stringify(remote));
          } catch {}
          for (const [id, data] of Object.entries(remote as Record<string, any>)) {
            const u = (data.portalUsername || data.phone || '').toString().trim().toLowerCase();
            const p = (data.portalPassword || '').toString().trim();
            if (u === cleanUser && p === cleanPass) {
              return { ...(data as object), id } as ClientProject;
            }
          }
        }
      }
    } catch {
      // Ignore network errors and continue to local check
    }

    // 3. Check LocalStorage cached clients
    const local = this.getLocalClients();
    for (const [id, data] of Object.entries(local)) {
      const u = (data.portalUsername || data.phone || '').toString().trim().toLowerCase();
      const p = (data.portalPassword || '').toString().trim();
      if (u === cleanUser && p === cleanPass) {
        return { id, ...data } as ClientProject;
      }
    }

    return null;
  }

  // Subscribe to real-time client updates
  public subscribeToClient(clientId: string, onChange: (client: ClientProject | null) => void): () => void {
    // 0. If Supabase is active, listen via Supabase Realtime WebSocket
    const sb = getSupabaseClient();
    if (sb) {
      let unsubscribed = false;

      // Immediate fetch
      Promise.resolve(sb.from('clients').select('*').eq('id', clientId).maybeSingle())
        .then(({ data }) => {
          if (!unsubscribed && data) onChange(transformSupabaseClient(data));
        })
        .catch(() => {});

      // Supabase Realtime WebSocket listener
      const channel = sb
        .channel(`client_realtime_${clientId}_${Date.now()}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'clients'
        }, (payload: any) => {
          if (!unsubscribed && payload.new && payload.new.id === clientId) {
            onChange(transformSupabaseClient(payload.new));
          }
        })
        .subscribe();

      // Reliable 1.5s interval to ensure instant updates even if websockets are delayed
      const pollTimer = setInterval(() => {
        if (unsubscribed) return;
        Promise.resolve(sb.from('clients').select('*').eq('id', clientId).maybeSingle())
          .then(({ data }) => {
            if (!unsubscribed && data) onChange(transformSupabaseClient(data));
          })
          .catch(() => {});
      }, 1500);

      return () => {
        unsubscribed = true;
        clearInterval(pollTimer);
        sb.removeChannel(channel);
      };
    }

    // 1. Fallback to LocalStorage, BroadcastChannel, and HTTP polling
    const notifyFromLocal = () => {
      const local = this.getLocalClients();
      if (local[clientId]) {
        onChange({ id: clientId, ...local[clientId] });
      } else if (clientId === 'demo_1') {
        onChange(DEMO_CLIENT);
      }
    };

    // Initial trigger
    notifyFromLocal();

    // Polling bridge on port 3000 every 1.5 seconds for instant cross-port sync
    const pollId = setInterval(async () => {
      try {
        const resp = await fetch('http://localhost:3000/api/storage/clients', {
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(1500)
        });
        if (resp.ok) {
          const remote = await resp.json();
          if (remote && remote[clientId]) {
            try {
              localStorage.setItem(STORAGE_KEY_PREFIX + 'clients', JSON.stringify(remote));
            } catch {}
            onChange({ ...(remote[clientId] as object), id: clientId } as ClientProject);
          }
        }
      } catch {}
    }, 1500);

    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY_PREFIX + 'clients') {
        notifyFromLocal();
      }
    };

    const onBcMessage = (event: MessageEvent) => {
      if (event.data?.col === 'clients' || event.data?.type === 'change') {
        notifyFromLocal();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', onStorage);
    }
    if (this.bc) {
      this.bc.addEventListener('message', onBcMessage);
    }

    return () => {
      clearInterval(pollId);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', onStorage);
      }
      if (this.bc) {
        this.bc.removeEventListener('message', onBcMessage);
      }
    };
  }
}

export const clientDataService = new ClientDataService();
