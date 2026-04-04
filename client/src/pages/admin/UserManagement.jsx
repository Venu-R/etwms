import { useEffect, useState } from 'react';
import { getUsersApi, updateUserApi, deleteUserApi } from '../../api/index';
import Spinner from '../../components/common/Spinner';
import { StatusBadge } from '../../components/common/Badge';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  const fetchUsers = () => {
    getUsersApi()
      .then((res) => setUsers(res.data.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleActive = async (user) => {
    await updateUserApi(user._id, { isActive: !user.isActive });
    fetchUsers();
  };

  const removeUser = async (user) => {
    const confirmed = window.confirm(`Delete ${user.name} permanently?`);
    if (!confirmed) return;

    await deleteUserApi(user._id);
    fetchUsers();
  };

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title="User Management"
      subtitle="Manage user access and status"
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
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              {['Name', 'Email', 'Role', 'Status', 'Actions'].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-slate-600 dark:text-slate-300 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">{user.name}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                <td className="px-4 py-3 capitalize text-slate-600 dark:text-slate-300">{user.role}</td>
                <td className="px-4 py-3"><StatusBadge status={user.isActive ? 'active' : 'inactive'} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleActive(user)} className="text-xs text-blue-600 dark:text-blue-300 hover:underline">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => removeUser(user)} className="text-xs text-red-600 dark:text-red-300 hover:underline">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardFrame>
  );
};

export default UserManagement;
