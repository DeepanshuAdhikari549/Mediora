import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  User,
  Moon,
  Sun,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Building2,
  ShieldCheck,
} from 'lucide-react';
import Button from './ui/Button';
import { useAuthStore } from '../store/authStore';
import AIAssistant from './AIAssistant';
import { useQueryClient } from 'react-query';

export default function Layout({ children, theme, setTheme }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      setMobileNavOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    queryClient.clear();
    setUserMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── HEADER ────────────────────────────────── */}
      <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500 text-white text-xs font-bold shadow shadow-sky-500/30">
              MC
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent tracking-tight">
              MediCompare
            </span>
          </Link>

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full flex items-center rounded-full border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 overflow-hidden">
              <Search className="absolute left-4 w-4 text-slate-400 flex-shrink-0" />
              <input
                id="nav-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="X-ray, Blood test, MRI, Full body checkup..."
                className="w-full pl-11 pr-4 py-2.5 bg-transparent text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="mr-1 px-4 py-1.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-sky-500/20 flex items-center justify-center">
                    <User className="w-4 h-4 text-sky-500" />
                  </div>
                  <span className="text-sm font-medium max-w-[120px] truncate">{user.name}</span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 py-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-xl z-50"
                      >
                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Signed in as</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{user.email}</p>
                          <span className="inline-flex items-center gap-1 mt-1 text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium capitalize">
                            {user.role === 'hospital' ? <Building2 className="w-3 h-3" /> : user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <User className="w-3 h-3" />}
                            {user.role}
                          </span>
                        </div>
                        <Link
                          to="/dashboard"
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <ShieldCheck className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign up
                </Button>
              </div>
            )}
          </div>

          {/* Mobile right — theme + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down nav */}
        <AnimatePresence>
          {mobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden border-t border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"
            >
              <div className="container mx-auto px-4 py-4 space-y-3">
                {/* Mobile search */}
                <form onSubmit={handleSearch} className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search hospitals, tests..."
                    className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/30"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-sky-500 text-white text-xs font-medium"
                  >
                    Search
                  </button>
                </form>

                {user ? (
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                      <div className="w-9 h-9 rounded-full bg-sky-500/20 flex items-center justify-center">
                        <User className="w-4 h-4 text-sky-500" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                    >
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileNavOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileNavOpen(false)}
                      className="flex-1 text-center py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MAIN ──────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── FOOTER ───────────────────────────────── */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-sky-500 text-white text-xs font-bold">MC</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">MediCompare</span>
            </div>
            <p>Find best hospitals &amp; lab tests at lowest price near you.</p>
            <div className="flex gap-4">
              <Link to="/search?city=Dehradun" className="hover:text-sky-500 transition-colors">Dehradun</Link>
              <Link to="/search?city=Delhi" className="hover:text-sky-500 transition-colors">Delhi</Link>
              <Link to="/compare" className="hover:text-sky-500 transition-colors">Compare</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── AI ASSISTANT ─────────────────────────── */}
      <AIAssistant />
    </div>
  );
}
