import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Shield, Zap } from 'lucide-react';
import Button from '../components/ui/Button';

const services = [
  'X-ray near me',
  'Blood test price',
  'MRI price',
  'CT scan cost',
  'Full body checkup',
  'Doctor consultation fee',
];

const features = [
  { icon: MapPin, title: 'Nearby hospitals & labs', desc: 'Find by location' },
  { icon: Star, title: 'Lowest price & ratings', desc: 'Compare and save' },
  { icon: Shield, title: 'Verified & certified', desc: 'NABL, insurance' },
  { icon: Zap, title: 'Book & pay online', desc: 'Slots & invoices' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [city, setCity] = useState('Dehradun');
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (city.trim()) params.set('city', city.trim());
    navigate('/search?' + params.toString());
  };
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-transparent to-indigo-500/10 pointer-events-none" />
      <section className="relative container mx-auto px-4 pt-16 pb-24 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Find best hospitals & lab tests at lowest price near you
        </motion.h1>
        <motion.p
          className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Compare prices, ratings, and book appointments in one place. Smart recommendations powered by AI.
        </motion.p>
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl glass-card"
          >
            <div className="relative flex-1 flex items-center rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 overflow-hidden">
              <Search className="absolute left-4 w-5 text-slate-400" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="X-ray, Blood test, MRI, Full body checkup..."
                className="w-full pl-12 pr-4 py-3 bg-transparent focus:outline-none text-slate-900 dark:text-slate-100"
              />
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (optional)"
              className="rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/80 px-4 py-3 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100"
            />
            <Button type="submit" size="lg" className="rounded-xl">
              Search
            </Button>
          </form>
        </motion.div>
        <motion.div
          className="flex flex-wrap justify-center gap-2 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {services.map((s, i) => (
            <Link key={i} to={`/search?q=${encodeURIComponent(s)}`}>
              <span className="inline-block px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 hover:text-sky-700 dark:hover:text-sky-300 transition-colors">
                {s}
              </span>
            </Link>
          ))}
        </motion.div>
      </section>

      <section className="relative container mx-auto px-4 py-16">
          <h2 className="section-title text-center mb-12">Why MediCompare?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="glass-card p-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-sky-500" />
              </div>
              <h3 className="font-semibold mb-2">{f.title}</h3>
              <p className="text-sm muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative container mx-auto px-4 py-16 text-center">
        <motion.div
          className="glass-card p-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-bold mb-4">Compare hospitals side-by-side</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            Select 2–3 hospitals and compare price, distance, rating, and slot availability.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link to="/compare">
              <Button>Go to Compare</Button>
            </Link>
            <Link to="/search?city=Dehradun">
              <Button variant="outline">Explore Dehradun</Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
