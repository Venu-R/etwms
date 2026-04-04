import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectByIdApi, getTasksByProjectApi, updateProjectApi } from '../../api/index';
import { useSocket } from '../../context/SocketContext';
import Spinner from '../../components/common/Spinner';
import { PriorityBadge, StatusBadge } from '../../components/common/Badge';
import useAppStore from '../../store/useAppStore';
import DashboardFrame from '../../components/layout/DashboardFrame';
import { useAuth } from '../../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { joinProject, leaveProject } = useSocket();
  const { logout } = useAuth();
  const { tasks, setTasks } = useAppStore();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjectByIdApi(id), getTasksByProjectApi(id)])
      .then(([pRes, tRes]) => {
        setProject(pRes.data.data.project);
        setTasks(tRes.data.data.tasks);
        joinProject(id);
      })
      .finally(() => setLoading(false));

    return () => leaveProject(id);
  }, [id]);

  const closeProject = async () => {
    await updateProjectApi(id, { status: 'completed' });
    setProject((prev) => ({ ...prev, status: 'completed' }));
  };

  if (loading) return <Spinner />;

  return (
    <DashboardFrame
      title={project?.title || 'Project'}
      subtitle={project?.description || 'Project details'}
      links={[{ to: '/manager', label: 'Dashboard' }]}
      rightAction={(
        <button onClick={logout} className="text-sm font-semibold text-red-600 dark:text-red-300 border border-red-200 dark:border-red-500/40 bg-red-50 dark:bg-red-500/15 hover:bg-red-100 dark:hover:bg-red-500/25 px-4 py-2 rounded-xl transition">
          Logout
        </button>
      )}
    >
      <button onClick={() => navigate('/manager')} className="text-sm text-blue-600 dark:text-blue-300 mb-4 hover:underline">Back</button>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{project?.title}</h1>
          <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">{project?.description}</p>
          <p className="text-slate-500 dark:text-slate-300 text-sm mt-1">Team: {project?.teamId?.name || 'N/A'}</p>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <StatusBadge status={project?.status} />
          {project?.status !== 'completed' ? (
            <button onClick={closeProject} className="text-sm text-red-500 dark:text-red-300 border border-red-300 dark:border-red-500/50 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-500/20">Close Project</button>
          ) : null}
          <button onClick={() => navigate(`/manager/projects/${id}/create-task`)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm transition">+ Add Task</button>
        </div>
      </div>

      <div className="grid gap-3">
        {tasks.map((task) => (
          <div key={task._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <p className="font-medium text-slate-800 dark:text-slate-100">{task.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-300 mt-0.5">Assigned to: {task.assignedTo?.name || task.assignedTo}</p>
            </div>
            <div className="flex gap-2 items-center">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
        ))}
        {tasks.length === 0 ? <p className="text-slate-400 dark:text-slate-500 text-sm">No tasks yet.</p> : null}
      </div>
    </DashboardFrame>
  );
};

export default ProjectDetail;
