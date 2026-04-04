const ActivityTimeline = ({ logs = [] }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3">Recent Activity</h3>
    <ul className="space-y-2">
      {logs.slice(0, 10).map((log) => (
        <li key={log._id} className="text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium text-slate-800 dark:text-slate-100">{log.userId?.name || 'User'}</span> {log.action} on {log.entityType}
        </li>
      ))}
      {logs.length === 0 ? <li className="text-xs text-slate-400 dark:text-slate-500">No activity yet.</li> : null}
    </ul>
  </div>
);

export default ActivityTimeline;
