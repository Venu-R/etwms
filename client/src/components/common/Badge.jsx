const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
  medium: 'bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
};

const statusColors = {
  pending: 'bg-gray-100 text-gray-700 dark:bg-slate-700/70 dark:text-slate-200',
  'in-progress': 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  completed: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300',
  planning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-300',
  active: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  inactive: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300',
};

export const PriorityBadge = ({ priority }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${priorityColors[priority] || 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-200'}`}>
    {priority}
  </span>
);

export const StatusBadge = ({ status }) => (
  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-200'}`}>
    {status}
  </span>
);
