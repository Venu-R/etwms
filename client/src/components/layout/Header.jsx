const Header = ({ title, subtitle }) => (
  <div className="mb-4">
    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h2>
    {subtitle ? <p className="text-sm text-slate-500 dark:text-slate-300 mt-1">{subtitle}</p> : null}
  </div>
);

export default Header;
