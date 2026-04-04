import { useEffect, useState } from 'react';
import { getTeamsApi, createTeamApi, getUsersApi, deleteTeamApi, updateTeamApi } from '../../api/index';
import Spinner from '../../components/common/Spinner';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const EmployeePicker = ({ employees, selectedIds, onToggle }) => (
  <div className="border border-slate-300 dark:border-slate-600 rounded-md p-2 max-h-36 overflow-y-auto bg-white dark:bg-slate-900">
    <div className="space-y-1">
      {employees.map((employee) => {
        const isSelected = selectedIds.includes(employee._id);
        return (
          <button
            key={employee._id}
            type="button"
            onClick={() => onToggle(employee._id)}
            className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
          >
            <span>{employee.name}</span>
            {isSelected ? <span className="text-xs font-bold">✓</span> : null}
          </button>
        );
      })}
      {employees.length === 0 ? <p className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1">No employees available.</p> : null}
    </div>
  </div>
);

const ManagerPicker = ({ managers, selectedId, onSelect }) => (
  <div className="border border-slate-300 dark:border-slate-600 rounded-md p-2 max-h-36 overflow-y-auto bg-white dark:bg-slate-900">
    <div className="space-y-1">
      {managers.map((manager) => {
        const isSelected = selectedId === manager._id;
        return (
          <button
            key={manager._id}
            type="button"
            onClick={() => onSelect(manager._id)}
            className={`w-full text-left px-2 py-1.5 rounded text-sm flex items-center justify-between ${isSelected ? 'bg-blue-50 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
          >
            <span>{manager.name}</span>
            {isSelected ? <span className="text-xs font-bold">✓</span> : null}
          </button>
        );
      })}
      {managers.length === 0 ? <p className="text-xs text-slate-400 dark:text-slate-500 px-2 py-1">No managers available.</p> : null}
    </div>
  </div>
);

const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', managerId: '', memberIds: [] });
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editMemberIds, setEditMemberIds] = useState([]);
  const { logout, user } = useAuth();

  const fetchAll = async () => {
    const [t, u] = await Promise.all([getTeamsApi(), getUsersApi()]);
    setTeams(t.data.data.teams);
    setUsers(u.data.data.users);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createTeamApi(form);
    setForm({ name: '', managerId: '', memberIds: [] });
    fetchAll();
  };

  const toggleCreateMember = (memberId) => {
    const nextMembers = form.memberIds.includes(memberId)
      ? form.memberIds.filter((id) => id !== memberId)
      : [...form.memberIds, memberId];
    setForm({ ...form, memberIds: nextMembers });
  };

  const handleDelete = async (id) => {
    await deleteTeamApi(id);
    fetchAll();
  };

  const startEditMembers = (team) => {
    const normalizedIds = (team.memberIds || []).map((m) => (typeof m === 'string' ? m : m?._id)).filter(Boolean);
    setEditingTeamId(team._id);
    setEditMemberIds(normalizedIds);
  };

  const toggleEditMember = (memberId) => {
    setEditMemberIds((prev) => (prev.includes(memberId) ? prev.filter((id) => id !== memberId) : [...prev, memberId]));
  };

  const saveEditMembers = async (teamId) => {
    await updateTeamApi(teamId, { memberIds: editMemberIds });
    setEditingTeamId(null);
    setEditMemberIds([]);
    fetchAll();
  };

  const employeeList = users.filter((u) => u.role === 'employee');
  const managerList = users.filter((u) => u.role === 'manager');
  const isAdmin = user?.role === 'admin';
  const basePath = isAdmin ? '/admin' : '/manager';
  const getUserName = (idOrObj) => {
    if (!idOrObj) return null;
    if (typeof idOrObj === 'object') return idOrObj.name || null;
    return users.find((u) => u._id === idOrObj)?.name || null;
  };

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title="Team Management"
      subtitle="Create and maintain team structures"
      links={[
        { to: `${basePath}`, label: 'Dashboard' },
        ...(isAdmin ? [{ to: '/admin/users', label: 'User Management' }] : []),
        { to: `${basePath}/teams`, label: 'Team Management' },
      ]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Team Name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-1.5 text-sm" required />
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Manager</label>
          <ManagerPicker
            managers={managerList}
            selectedId={form.managerId}
            onSelect={(managerId) => setForm({ ...form, managerId })}
          />
        </div>
        <div>
          <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Employees</label>
          <EmployeePicker employees={employeeList} selectedIds={form.memberIds} onToggle={toggleCreateMember} />
        </div>
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm transition">Create</button>
      </form>

      <div className="grid gap-4">
        {teams.map((team) => (
          <div key={team._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-800 dark:text-slate-100">{team.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Manager: {team.managerId?.name || 'N/A'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-300">Members: {team.memberIds?.length || 0}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Employee names: {(team.memberIds || []).map(getUserName).filter(Boolean).join(', ') || 'None'}
                </p>

                {editingTeamId === team._id ? (
                  <div className="mt-3">
                    <p className="text-xs text-slate-600 dark:text-slate-300 mb-1">Edit team employees</p>
                    <EmployeePicker employees={employeeList} selectedIds={editMemberIds} onToggle={toggleEditMember} />
                    <div className="flex gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => saveEditMembers(team._id)}
                        className="text-xs font-medium text-white bg-blue-600 border border-blue-600 px-3 py-1.5 rounded hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTeamId(null);
                          setEditMemberIds([]);
                        }}
                        className="text-xs font-medium text-slate-600 dark:text-slate-200 border border-slate-300 dark:border-slate-600 px-3 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => startEditMembers(team)}
                  className="text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/40 px-3 py-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-500/20"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(team._id)}
                  className="text-xs font-medium text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 px-3 py-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardFrame>
  );
};

export default TeamManagement;
