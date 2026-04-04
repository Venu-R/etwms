import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createTaskApi, getProjectByIdApi, getTeamsApi } from '../../api/index';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const CreateTask = () => {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [projectTeamName, setProjectTeamName] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium',
    deadline: '',
  });

  useEffect(() => {
    Promise.all([getProjectByIdApi(projectId), getTeamsApi()])
      .then(([projectRes, teamsRes]) => {
        const project = projectRes.data.data.project;
        const projectTeamId = typeof project.teamId === 'object' ? project.teamId?._id : project.teamId;
        const teams = teamsRes.data.data.teams || [];
        const matchedTeam = teams.find((team) => String(team._id) === String(projectTeamId));
        const teamMembers = (matchedTeam?.memberIds || []).filter((member) => {
          if (!member || typeof member !== 'object') return false;
          return member.role ? member.role === 'employee' : true;
        });
        setProjectTeamName(matchedTeam?.name || project.teamId?.name || '');
        setEmployees(teamMembers);
      })
      .catch(() => {
        setProjectTeamName('');
        setEmployees([]);
      });
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.assignedTo) return;
    await createTaskApi({ ...form, projectId });
    navigate(`/manager/projects/${projectId}`);
  };

  return (
    <DashboardFrame
      title="Create Task"
      subtitle="Assign work to employees"
      links={[{ to: '/manager', label: 'Dashboard' }]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <div className="max-w-lg">
        <button onClick={() => navigate(-1)} className="text-sm text-blue-600 dark:text-blue-300 mb-4 hover:underline">Back</button>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Create Task</h1>
        {projectTeamName ? <p className="text-sm text-slate-500 dark:text-slate-300 mb-3">Team: {projectTeamName}</p> : null}
        <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Title</label>
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" rows={3} />
          </div>
          <div>
            <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Assign to employee</label>
            <select
              required
              value={form.assignedTo}
              onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
              className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm"
            >
              <option value="">Select employee</option>
              {employees.map((u) => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
            {employees.length === 0 ? <p className="text-xs text-amber-600 mt-1">No employees found in this project's team.</p> : null}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Deadline</label>
              <input type="date" required value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className="w-full border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition">Create Task</button>
        </form>
      </div>
    </DashboardFrame>
  );
};

export default CreateTask;
