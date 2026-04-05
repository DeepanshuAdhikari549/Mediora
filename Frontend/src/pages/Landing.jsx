import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Shield, Zap, ArrowRight, HeartPulse } from 'lucide-react';
import HospitalCard from '../components/HospitalCard';
import { hospitalsApi } from '../lib/api';

const services = [
  'X-ray near me',
  'Blood test price',
  'MRI price',
  'CT scan cost',
  'Full body checkup',
  'Doctor consultation fee',
];

const features = [
  { icon: MapPin, title: 'Nearby hospitals & labs', desc: 'Find by location effortlessly' },
  { icon: Star, title: 'Lowest price & ratings', desc: 'Compare and save money' },
  { icon: Shield, title: 'Verified & certified', desc: 'NABL accreditations verified' },
  { icon: Zap, title: 'Book & pay online', desc: 'Instant slotted appointments' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Dehradun');
  const [topHospitals, setTopHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    hospitalsApi.list({ sort: '-rating', limit: 3 })
      .then(res => setTopHospitals(res.hospitals?.slice(0, 3) || []))
      .catch(err => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    navigate('/search?' + params.toString());
  };

  return (
    <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen">
      {/* Background Orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-teal-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative container mx-auto px-4 pt-24 pb-32 text-center min-h-[90vh] flex flex-col items-center justify-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.6 }}
           className="mb-8 relative"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full opacity-20 blur-xl animate-pulse" />
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-6 py-2.5 rounded-full inline-flex items-center gap-3 shadow-xl">
             <HeartPulse className="w-5 h-5 text-teal-500" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-slate-200">The Future of Medical Care</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tight mb-8 leading-tight max-w-5xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Perfect Care.</span>
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Compare prices, verified ratings, and instantly book slots at top hospitals and labs. Powered by state-of-the-art AI recommendations.
        </motion.p>

        <motion.div
          className="max-w-4xl mx-auto w-full mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4 p-4 rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl shadow-teal-500/10"
          >
            <div className="relative flex-1 flex items-center bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-teal-500 transition-colors">
              <Search className="absolute left-6 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search X-ray, Blood test, MRI..."
                className="w-full pl-16 pr-6 py-5 md:py-6 bg-transparent text-lg focus:outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
              />
            </div>
            <div className="relative flex-1 md:max-w-xs flex items-center bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border-2 border-transparent focus-within:border-teal-500 transition-colors">
              <MapPin className="absolute left-6 w-6 h-6 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="City"
                className="w-full pl-16 pr-6 py-5 md:py-6 bg-transparent text-lg focus:outline-none text-slate-900 dark:text-white font-medium placeholder:text-slate-400"
              />
            </div>
            <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-12 py-5 md:py-6 text-lg font-black transition-all shadow-xl shadow-teal-500/30 flex items-center justify-center gap-3 active:scale-95">
              Explore <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {services.map((s, i) => (
            <Link key={i} to={`/search?q=${encodeURIComponent(s)}`}>
              <span className="inline-flex items-center px-6 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-teal-50 hover:border-teal-200 dark:hover:bg-teal-900/30 dark:hover:border-teal-800 hover:text-teal-600 dark:hover:text-teal-400 transition-all shadow-sm">
                {s}
              </span>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* Featured Hospitals Section */}
      <section className="relative py-32 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">Top Rated Institutions</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Discover world-class healthcare facilities, highly rated by patients like you.</p>
            </div>
            <Link to="/search">
              <button className="h-16 px-10 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-black uppercase tracking-widest text-xs hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 transition-all flex items-center gap-3 shadow-xl shadow-slate-200/20 dark:shadow-none">
                View All Directory <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1,2,3].map(i => (
                <div key={i} className="h-96 rounded-[3rem] bg-slate-200 dark:bg-slate-800 animate-pulse border border-slate-300 dark:border-slate-700" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {topHospitals.map(hospital => (
                <HospitalCard key={hospital._id} hospital={hospital} className="w-full" />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative container mx-auto px-4 py-32">
          <h2 className="text-4xl md:text-6xl font-black text-center text-slate-900 dark:text-white mb-24 tracking-tight">Why Choose MediCompare?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-200/40 dark:shadow-none relative group hover:-translate-y-2 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <div className="absolute top-0 right-0 p-8 w-full h-full bg-gradient-to-br from-teal-500/5 to-transparent rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center mb-8 border border-teal-100 dark:border-teal-800/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <f.icon className="w-10 h-10 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 leading-snug">{f.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-lg">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative container mx-auto px-4 pb-32 text-center">
        <motion.div
          className="bg-gradient-to-br from-teal-600 to-blue-700 p-16 md:p-24 rounded-[4rem] max-w-6xl mx-auto shadow-2xl shadow-teal-500/30 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
          <h2 className="text-5xl md:text-7xl font-black text-white mb-8 relative z-10 leading-tight tracking-tight">Ready to modernize your healthcare?</h2>
          <p className="text-teal-100/90 text-xl md:text-2xl font-medium mb-16 max-w-3xl mx-auto relative z-10 leading-relaxed">
            Join thousands of users discovering the best care options seamlessly. Real verified hospitals. Zero hidden fees.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
             <Link to="/search">
              <button className="h-16 px-12 rounded-2xl bg-white text-teal-800 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                 Start Exploring Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
