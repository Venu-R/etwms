import { useEffect, useState } from 'react';
import { employeeDashboardApi, updateTaskApi } from '../../api/index';
import Spinner from '../../components/common/Spinner';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import useAppStore from '../../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import TaskStatusPie from '../../components/charts/TaskStatusPie';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const EmployeeDashboard = () => {
  const { tasks, setTasks, updateTaskInStore } = useAppStore();
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    employeeDashboardApi()
      .then((res) => {
        setTasks(res.data.data.tasks);
        setStats(res.data.data.stats);
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const markCompleted = async (taskId) => {
    const res = await updateTaskApi(taskId, { status: 'completed' });
    updateTaskInStore(taskId, { status: res.data.data.task.status });
  };

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title="Employee Dashboard"
      subtitle="Track your workload and progress"
      links={[
        { to: '/employee', label: 'My Tasks' },
      ]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <p className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Hello {user?.name || 'Employee'}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', value: stats?.pending, status: 'pending' },
          { label: 'In Progress', value: stats?.inProgress, status: 'in-progress' },
          { label: 'Completed', value: stats?.completed, status: 'completed' },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition" onClick={() => setFilter(filter === s.status ? 'all' : s.status)}>
            <p className="text-sm text-slate-500 dark:text-slate-300">{s.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{s.value ?? 0}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6">
        <TaskStatusPie tasks={tasks} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {['all', 'pending', 'in-progress', 'completed'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded text-sm ${filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-200'}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {filteredTasks.map((task) => (
          <div key={task._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-400 transition" onClick={() => navigate(`/employee/tasks/${task._id}`)}>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
              <p className="font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
              <div className="flex gap-2 items-center">
                {task.status !== 'completed' ? (
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.stopPropagation();
                      await markCompleted(task._id);
                    }}
                    className="text-xs font-semibold text-green-700 dark:text-green-300 border border-green-200 dark:border-green-500/40 bg-green-50 dark:bg-green-500/15 px-2 py-1 rounded"
                    title="Mark as completed"
                  >
                    ✓
                  </button>
                ) : null}
                <PriorityBadge priority={task.priority} />
                <StatusBadge status={task.status} />
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">Project: {task.projectId?.title || task.projectId}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
          </div>
        ))}
        {filteredTasks.length === 0 ? <p className="text-slate-400 dark:text-slate-500 text-sm">No tasks here.</p> : null}
      </div>
    </DashboardFrame>
  );
};

export default EmployeeDashboard;
