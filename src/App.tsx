import { useState, useEffect } from 'react';
import type { ClientProject } from './types';
import { clientDataService, DEMO_CLIENT } from './services/dataService';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [client, setClient] = useState<ClientProject | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [initialCreds, setInitialCreds] = useState({ u: '', p: '' });

  // Initialize theme
  useEffect(() => {
    const savedTheme = (localStorage.getItem('tab3_theme') as 'dark' | 'light') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('tab3_theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  // Check URL params for auto-login (from data-dashboard "معاينة كعميل" button)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const uParam = urlParams.get('u');
    const pParam = urlParams.get('p');
    const demoParam = urlParams.get('demo');

    if (demoParam === '1' || demoParam === 'true') {
      handleDemoLogin();
      return;
    }

    const dataParam = urlParams.get('data');
    if (dataParam) {
      try {
        const parsed = JSON.parse(decodeURIComponent(dataParam));
        if (parsed && (parsed.portalUsername || parsed.name)) {
          setClient(parsed);
          sessionStorage.setItem('tab3_session_client_id', parsed.id || 'client_current');
          try {
            const raw = localStorage.getItem('sales_crm_clients');
            const map = raw ? JSON.parse(raw) : {};
            map[parsed.id || 'client_current'] = parsed;
            localStorage.setItem('sales_crm_clients', JSON.stringify(map));
          } catch {}
          try {
            window.history.replaceState({}, '', window.location.pathname);
          } catch {}
          return;
        }
      } catch (e) {
        console.warn('Error parsing data token:', e);
      }
    }

    if (uParam && pParam) {
      setInitialCreds({ u: uParam, p: pParam });
      clientDataService.authenticate(uParam, pParam).then((res) => {
        if (res) {
          setClient(res);
          sessionStorage.setItem('tab3_session_client_id', res.id);
        }
      });
      return;
    }

    // Check saved session
    const savedCid = sessionStorage.getItem('tab3_session_client_id');
    if (savedCid) {
      if (savedCid === 'demo_1') {
        setClient(DEMO_CLIENT);
      } else {
        const raw = localStorage.getItem('sales_crm_clients');
        if (raw) {
          try {
            const map = JSON.parse(raw);
            if (map[savedCid]) {
              setClient({ ...map[savedCid], id: savedCid });
            }
          } catch {}
        }
      }
    }
  }, []);

  // Real-time subscription to client project changes
  useEffect(() => {
    if (!client?.id) {
      setIsLive(false);
      return;
    }

    setIsLive(true);
    const unsubscribe = clientDataService.subscribeToClient(client.id, (fresh) => {
      if (fresh) {
        setClient(fresh);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [client?.id]);

  const handleLogin = async (username: string, pass: string): Promise<boolean> => {
    const res = await clientDataService.authenticate(username, pass);
    if (res) {
      setClient(res);
      sessionStorage.setItem('tab3_session_client_id', res.id);
      return true;
    }
    return false;
  };

  const handleDemoLogin = () => {
    setClient(DEMO_CLIENT);
    sessionStorage.setItem('tab3_session_client_id', 'demo_1');
  };

  const handleLogout = () => {
    setClient(null);
    sessionStorage.removeItem('tab3_session_client_id');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        client={client}
        theme={theme}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
        isLive={isLive}
      />

      <main style={{ flex: 1 }}>
        {client ? (
          <DashboardView client={client} />
        ) : (
          <LoginView
            onLogin={handleLogin}
            onDemoLogin={handleDemoLogin}
            initialUsername={initialCreds.u}
            initialPassword={initialCreds.p}
          />
        )}
      </main>
    </div>
  );
}

export default App;
