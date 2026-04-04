import { useEffect, useState } from 'react';
import { managerDashboardApi, createProjectApi, getTeamsApi } from '../../api/index';
import Spinner from '../../components/common/Spinner';
import { StatusBadge } from '../../components/common/Badge';
import { useNavigate } from 'react-router-dom';
import ProgressChart from '../../components/charts/ProgressChart';
import TaskStatusPie from '../../components/charts/TaskStatusPie';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const ManagerDashboard = () => {
  const [data, setData] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', teamId: '', startDate: '', endDate: '' });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    Promise.all([managerDashboardApi(), getTeamsApi()])
      .then(([dashboardRes, teamsRes]) => {
        setData(dashboardRes.data.data);
        setTeams(teamsRes.data.data.teams || []);
      })
      .catch(() => {
        setTeams([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await createProjectApi(form);
    setShowForm(false);
    setForm({ title: '', description: '', teamId: '', startDate: '', endDate: '' });
    fetchData();
  };

  const selectedTeam = teams.find((team) => team._id === form.teamId) || null;

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title="Manager Workspace"
      subtitle="Plan projects and deliver tasks"
      links={[
        { to: '/manager', label: 'Dashboard' },
        { to: '/manager/teams', label: 'Team Management' },
      ]}
      rightAction={(
        <div className="flex items-center gap-2">
          <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white px-4 py-2 rounded-xl text-sm shadow-sm hover:brightness-105 transition">+ New Project</button>
          <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
            Logout
          </button>
        </div>
      )}
    >

      <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Hello {user?.name || 'Manager'}</p>

      {showForm ? (
        <form onSubmit={handleCreate} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Project Title</label>
            <input placeholder="Project title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Team</label>
            <select
              required
              value={form.teamId}
              onChange={(e) => setForm({ ...form, teamId: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm"
            >
              <option value="">Select team</option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>{team.name}</option>
              ))}
            </select>
            {teams.length === 0 ? <p className="text-xs text-amber-600 mt-1">No teams available. Ask admin to create a team first.</p> : null}
            {selectedTeam ? (
              <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                Team employees: {(selectedTeam.memberIds || []).map((m) => (typeof m === 'object' ? m.name : m)).filter(Boolean).join(', ') || 'None'}
              </p>
            ) : null}
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Start Date</label>
            <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">End Date</label>
            <input type="date" required value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2 flex gap-2">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-slate-500 dark:text-slate-300">Cancel</button>
          </div>
        </form>
      ) : null}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"><ProgressChart projects={data?.projects || []} tasks={data?.tasks || []} /></div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4"><TaskStatusPie tasks={data?.tasks || []} /></div>
      </div>

      <div className="grid gap-4">
        {(data?.projects || []).map((project) => (
          <div key={project._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition" onClick={() => navigate(`/manager/projects/${project._id}`)}>
            <div className="flex justify-between items-start">
              <p className="font-semibold text-slate-800 dark:text-slate-100">{project.title}</p>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">{project.description}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Team: {project.teamId?.name || 'N/A'}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">Teams Available</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {teams.map((team) => (
            <div key={team._id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 bg-slate-50/50 dark:bg-slate-800/40">
              <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{team.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-300">Manager: {team.managerId?.name || 'N/A'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Employees: {(team.memberIds || []).map((m) => (typeof m === 'object' ? m.name : m)).filter(Boolean).join(', ') || 'None'}
              </p>
            </div>
          ))}
          {teams.length === 0 ? <p className="text-xs text-slate-400 dark:text-slate-500">No teams loaded.</p> : null}
        </div>
      </div>
    </DashboardFrame>
  );
};

export default ManagerDashboard;
