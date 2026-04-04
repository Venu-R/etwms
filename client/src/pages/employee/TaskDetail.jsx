import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMyTasksApi, updateTaskApi, addCommentApi } from '../../api/index';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import useAppStore from '../../store/useAppStore';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const tasks = useAppStore((s) => s.tasks);
  const setTasks = useAppStore((s) => s.setTasks);
  const updateTaskInStore = useAppStore((s) => s.updateTaskInStore);
  const [task, setTask] = useState(() => tasks.find((t) => t._id === id));
  const [commentText, setCommentText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) return;
    getMyTasksApi().then((res) => {
      const fetched = res.data.data.tasks;
      setTasks(fetched);
      setTask(fetched.find((t) => t._id === id));
    });
  }, [id, task]);

  const handleStatusChange = async (newStatus) => {
    setSaving(true);
    const res = await updateTaskApi(id, { status: newStatus });
    const updated = res.data.data.task;
    setTask(updated);
    updateTaskInStore(id, { status: newStatus });
    setSaving(false);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await addCommentApi(id, commentText);
    setTask((prev) => ({ ...prev, comments: [...(prev.comments || []), res.data.data.comment] }));
    setCommentText('');
  };

  if (!task) {
    return (
      <DashboardFrame
        title="Task"
        subtitle="Details"
        links={[{ to: '/employee', label: 'My Tasks' }]}
        rightAction={(
          <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
            Logout
          </button>
        )}
      >
        <p className="text-slate-400 dark:text-slate-500">Task not found.</p>
      </DashboardFrame>
    );
  }

  return (
    <DashboardFrame
      title="Task Detail"
      subtitle="Update status and collaborate"
      links={[{ to: '/employee', label: 'My Tasks' }]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <div className="max-w-2xl">
        <button onClick={() => navigate('/employee')} className="text-sm text-blue-600 dark:text-blue-300 mb-4 hover:underline">Back</button>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 mb-4">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{task.title}</h1>
            <div className="flex flex-wrap gap-2">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">{task.description}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-2 font-medium">Update status:</p>
            <div className="flex flex-wrap gap-2">
              {['pending', 'in-progress', 'completed'].map((s) => (
                <button
                  key={s}
                  disabled={task.status === s || saving}
                  onClick={() => handleStatusChange(s)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition ${task.status === s ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700'} disabled:opacity-50`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4">
          <h2 className="font-semibold text-slate-700 dark:text-slate-100 mb-4">Comments</h2>
          <div className="space-y-3 mb-4">
            {(task.comments || []).map((c, i) => (
              <div key={i} className="text-sm border-b border-slate-100 dark:border-slate-800 pb-2">
                <span className="font-medium text-slate-700 dark:text-slate-200">{c.userId?.name || 'User'}:</span>
                <span className="text-slate-600 dark:text-slate-300 ml-2">{c.text}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-2">{new Date(c.timestamp).toLocaleString()}</span>
              </div>
            ))}
            {task.comments?.length === 0 ? <p className="text-slate-400 dark:text-slate-500 text-sm">No comments yet.</p> : null}
          </div>
          <form onSubmit={handleComment} className="flex flex-col sm:flex-row gap-2">
            <input value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded px-3 py-2 text-sm" />
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition">Post</button>
          </form>
        </div>
      </div>
    </DashboardFrame>
  );
};

export default TaskDetail;
