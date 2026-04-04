import { Link } from 'react-router-dom';

const Sidebar = ({ links = [] }) => (
  <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 min-h-screen p-4">
    <p className="font-bold text-lg mb-4 text-slate-800 dark:text-slate-100">ETWMS</p>
    <nav className="space-y-2">
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="block text-sm text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300">
          {l.label}
        </Link>
      ))}
    </nav>
  </aside>
);

export default Sidebar;
