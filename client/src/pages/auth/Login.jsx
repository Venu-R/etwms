import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const Login = () => {
  const [mode, setMode] = useState('signin');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const { login, register, loading } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const clearFormFields = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setInfo('');
    clearFormFields();
  };

  const applyRole = (role) => {
    setSelectedRole(role);
    setError('');
    setInfo('');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const result = await login(email, password, selectedRole);
    if (result.success) {
      if (result.role === 'admin') navigate('/admin');
      else if (result.role === 'manager') navigate('/manager');
      else if (result.role === 'employee') navigate('/employee');
    } else {
      setError(result.message);
      clearFormFields();
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    const result = await register({ name, email, password, role: selectedRole });
    if (result.success) {
      setInfo('Account created. You can sign in now.');
      setMode('signin');
      clearFormFields();
    } else {
      setError(result.message);
      clearFormFields();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-100 dark:bg-slate-950 transition-colors duration-300">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#0ea5e920,transparent_35%),radial-gradient(circle_at_75%_10%,#2563eb22,transparent_30%),radial-gradient(circle_at_80%_80%,#14b8a622,transparent_40%)] dark:bg-[radial-gradient(circle_at_20%_20%,#22d3ee33,transparent_35%),radial-gradient(circle_at_75%_10%,#3b82f655,transparent_30%),radial-gradient(circle_at_80%_80%,#14b8a644,transparent_40%)]" />

      <button
        type="button"
        onClick={toggleTheme}
        className="absolute right-6 top-6 z-20 rounded-full border border-slate-300/60 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-100"
      >
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </button>

      <div className="relative z-10 grid min-h-screen md:grid-cols-2">
        <section className="hidden md:flex flex-col justify-between p-12 text-white bg-gradient-to-br from-cyan-600 via-blue-700 to-slate-900 dark:from-cyan-500 dark:via-blue-700 dark:to-slate-950">
          <div>
            <p className="uppercase text-xs tracking-[0.35em] text-cyan-100">Enterprise Workflow</p>
            <h1 className="text-5xl font-bold mt-5 leading-tight">Task and Workflow Control Center</h1>
            <p className="mt-6 text-lg text-cyan-100/95 max-w-md">Coordinate teams, projects, and execution with real-time visibility built for admins, managers, and employees.</p>
          </div>
          <div className="flex items-center gap-4 text-sm text-cyan-100/90">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-300 animate-pulse" />
            Live collaboration enabled
          </div>
        </section>

        <section className="flex items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200/70 dark:border-slate-800 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl shadow-[0_20px_80px_-30px_rgba(0,0,0,0.35)] p-8 md:p-10">
            <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mb-6">
              <button type="button" onClick={() => switchMode('signin')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'signin' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Sign In</button>
              <button type="button" onClick={() => switchMode('signup')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'signup' ? 'bg-white dark:bg-slate-700 shadow text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-300'}`}>Sign Up</button>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{mode === 'signin' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-300 mb-5">Choose role and continue to ETWMS.</p>

            <div className="grid grid-cols-3 gap-2 mb-5">
              {['admin', 'manager', 'employee'].map((role) => (
                <button key={role} type="button" onClick={() => applyRole(role)} className={`rounded-xl px-2 py-2 text-xs font-semibold capitalize border transition ${selectedRole === role ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-200' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300'}`}>
                  {role}
                </button>
              ))}
            </div>

            {error ? <p className="text-red-500 text-sm mb-3">{error}</p> : null}
            {info ? <p className="text-emerald-500 text-sm mb-3">{info}</p> : null}

            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-slate-800 dark:from-cyan-500 dark:via-blue-600 dark:to-slate-700 text-white py-2.5 rounded-xl font-semibold hover:opacity-95 disabled:opacity-50">
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Email</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <div>
                  <label className="block text-sm text-slate-600 dark:text-slate-300 mb-1">Password</label>
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-slate-300 dark:border-slate-700 bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" required />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-slate-800 dark:from-cyan-500 dark:via-blue-600 dark:to-slate-700 text-white py-2.5 rounded-xl font-semibold hover:opacity-95 disabled:opacity-50">
                  {loading ? 'Creating...' : `Create ${selectedRole} Account`}
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Login;
