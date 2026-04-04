const Navbar = ({ title }) => (
  <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-3">
    <h1 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{title}</h1>
  </header>
);

export default Navbar;
