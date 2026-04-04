import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
  pending: '#F59E0B',
  'in-progress': '#3B82F6',
  completed: '#10B981',
};

const TaskStatusPie = ({ tasks = [] }) => {
  const data = [
    { name: 'pending', value: tasks.filter((t) => t.status === 'pending').length },
    { name: 'in-progress', value: tasks.filter((t) => t.status === 'in-progress').length },
    { name: 'completed', value: tasks.filter((t) => t.status === 'completed').length },
  ].filter((d) => d.value > 0);

  if (data.length === 0) {
    return <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">No task data available yet.</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          {data.map((entry) => (
            <Cell key={entry.name} fill={COLORS[entry.name] || '#8884d8'} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #CBD5E1' }} />
        <Legend wrapperStyle={{ color: '#94A3B8', fontSize: '12px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TaskStatusPie;
