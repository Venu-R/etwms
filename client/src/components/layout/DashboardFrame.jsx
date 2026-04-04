import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const DashboardFrame = ({ title, subtitle, links, children, rightAction }) => {
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="flex min-h-screen">
        <div
          className={`fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-sm transition-opacity md:hidden ${isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />

        <aside className={`fixed inset-y-0 left-0 z-40 w-72 overflow-y-auto bg-gradient-to-b from-cyan-600 via-blue-700 to-slate-900 dark:from-cyan-500 dark:via-blue-700 dark:to-slate-950 text-white p-5 transform transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-cyan-200">Enterprise</p>
            <h1 className="text-2xl font-bold mt-1">ETWMS</h1>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="w-full mb-4 rounded-xl border border-white/30 bg-white/15 hover:bg-white/25 px-3 py-2 text-xs font-semibold text-cyan-50"
          >
            {isDark ? 'Light Mode' : 'Dark Mode'}
          </button>

          <nav className="space-y-2 mb-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`block px-3 py-2 rounded-lg text-sm transition ${location.pathname === l.to ? 'bg-white/25 text-white' : 'text-slate-100 hover:bg-white/10'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="text-xs text-cyan-200 bg-white/10 rounded-xl p-3">
            Real-time updates enabled
          </div>
        </aside>

        <main className="flex-1 p-4 sm:p-6 md:p-8 bg-[radial-gradient(circle_at_85%_10%,rgba(14,165,233,0.10),transparent_35%)] dark:bg-[radial-gradient(circle_at_85%_10%,rgba(56,189,248,0.18),transparent_35%)]">
          <div className="mb-4 flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-3 md:hidden">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg border border-slate-300 dark:border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-100"
            >
              Menu
            </button>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-100">ETWMS</p>
          </div>

          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
                <p className="text-slate-500 dark:text-slate-300 mt-1">{subtitle}</p>
              </div>
              <div className="w-full sm:w-auto flex flex-wrap items-center gap-2 sm:justify-end">{rightAction}</div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardFrame;
