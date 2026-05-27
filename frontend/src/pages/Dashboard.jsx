import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-white">
      {/* Top Bar */}
      <nav className="border-b border-navy-700/40 bg-navy-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-accent-blue flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.04-7 10.2-3.87-1.16-7-5.53-7-10.2V6.3l7-3.12z"/>
                <path d="M12 7a2 2 0 00-2 2v2a2 2 0 001 1.73V15a1 1 0 002 0v-2.27A2 2 0 0014 11V9a2 2 0 00-2-2z"/>
              </svg>
            </div>
            <span className="font-bold text-lg">Privora</span>
            <span className="text-xs text-slate-500 ml-2 uppercase tracking-widest">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <div
              className="px-4 py-2 rounded-lg border border-navy-500 text-sm text-slate-300 cursor-pointer hover:bg-navy-800 hover:border-navy-400 transition-all duration-200 select-none"
              onClick={handleLogout}
              role="button"
              tabIndex={0}
              id="logout-btn"
            >
              Sign Out
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center">
            <svg className="w-10 h-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">Welcome back{user?.full_name ? `, ${user.full_name}` : ''}</h1>
          <p className="text-slate-400 max-w-md mx-auto mb-10">
            Your Sentinel Vault is secure. All systems operational.
          </p>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: 'Encryption Status', value: 'Active', color: 'text-emerald-400', dot: 'bg-emerald-400' },
              { label: 'Threat Level', value: 'Low', color: 'text-accent-light', dot: 'bg-accent-blue' },
              { label: 'Last Scan', value: 'Just Now', color: 'text-slate-300', dot: 'bg-slate-400' },
            ].map((card) => (
              <div key={card.label} className="p-6 rounded-2xl bg-navy-900/60 border border-navy-700/40">
                <p className="text-[10px] tracking-[0.2em] text-slate-500 uppercase font-semibold mb-3">{card.label}</p>
                <p className={`text-xl font-bold flex items-center justify-center gap-2 ${card.color}`}>
                  <span className={`w-2 h-2 rounded-full ${card.dot}`} />
                  {card.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
