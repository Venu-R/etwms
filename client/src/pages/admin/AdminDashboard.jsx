import { useEffect, useState } from 'react';
import { adminDashboardApi } from '../../api/index';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import ActivityTimeline from '../../components/charts/ActivityTimeline';
import DashboardFrame from '../../components/layout/DashboardFrame';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();

  useEffect(() => {
    adminDashboardApi()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title="Admin Dashboard"
      subtitle="Overview and governance controls"
      links={[
        { to: '/admin', label: 'Dashboard' },
        { to: '/admin/users', label: 'User Management' },
        { to: '/admin/teams', label: 'Team Management' },
      ]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Hello {user?.name || 'Admin'}</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Users', value: data?.userCount },
          { label: 'Teams', value: data?.teamCount },
          { label: 'Projects', value: data?.projectCount },
          { label: 'Tasks', value: data?.taskCount },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">{card.label}</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-2">{card.value ?? '-'}</p>
          </div>
        ))}
      </div>

      <ActivityTimeline logs={data?.recentLogs || []} />
    </DashboardFrame>
  );
};

export default AdminDashboard;
