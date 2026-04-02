import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Search from './pages/Search';
import HospitalDetail from './pages/HospitalDetail';
import Compare from './pages/Compare';
import BookingPage from './pages/BookingPage';
import Payment from './pages/Payment';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';

// Lazy-load heavy 3D Features page to prevent crashes if @react-three/fiber is absent
const Features = lazy(() =>
  import('./pages/Features').catch(() => ({
    default: () => (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Features</h1>
        <p className="text-slate-500">Feature details coming soon.</p>
      </div>
    ),
  }))
);

function App() {
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setTheme = (t) => setThemeState(t);

  return (
    <Layout theme={theme} setTheme={setTheme}>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/search" element={<Search />} />
          <Route path="/hospital/:slug" element={<HospitalDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/booking/:hospitalSlug" element={<BookingPage />} />
          <Route path="/payment/:bookingId" element={<Payment />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/features" element={<Features />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
