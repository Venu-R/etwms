import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ProgressChart = ({ projects = [], tasks = [] }) => {
  if (!projects.length) {
    return <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">No projects yet.</div>;
  }

  const data = projects.map((p) => {
    const projectId = String(p._id);
    const projectTasks = tasks.filter((t) => {
      const taskProjectId = typeof t.projectId === 'object' ? t.projectId?._id : t.projectId;
      return String(taskProjectId) === projectId;
    });
    const total = projectTasks.length;
    const completed = projectTasks.filter((t) => t.status === 'completed').length;
    return {
      name: p.title?.length > 12 ? `${p.title.slice(0, 12)}...` : p.title,
      completion: total ? Math.round((completed / total) * 100) : 0,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94A3B8' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94A3B8' }} unit="%" />
        <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: '10px', border: '1px solid #CBD5E1' }} />
        <Bar dataKey="completion" radius={[4, 4, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.completion === 100 ? '#10B981' : '#3B82F6'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProgressChart;
