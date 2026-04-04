const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-orange-100 text-orange-800',
  high: 'bg-red-100 text-red-800',
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  planning: 'bg-yellow-100 text-yellow-700',
  active: 'bg-blue-100 text-blue-700',
}

export const PriorityBadge = ({ priority }) => (
  <span className={`px-2 py-1 rounded text-xs ${priorityColors[priority]}`}>
    {priority}
  </span>
)

export const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
    {status}
  </span>
)