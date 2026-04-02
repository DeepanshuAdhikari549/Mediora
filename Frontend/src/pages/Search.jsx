import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, IndianRupee, Filter, ChevronRight, BadgeCheck, LocateFixed } from 'lucide-react';
import { useQuery } from 'react-query';
import { hospitalsApi, recommendApi } from '../lib/api';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { cn } from '../lib/utils';

const SORT_OPTIONS = [
  { value: 'rating', label: 'Best rating' },
  { value: 'price', label: 'Lowest price' },
  { value: 'distance', label: 'Nearest' },
];

const FILTERS = [
  { key: 'homeSample', label: 'Home sample' },
  { key: 'nablCertified', label: 'NABL certified' },
  { key: 'insuranceSupported', label: 'Insurance' },
  { key: 'available24x7', label: '24x7' },
];

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const city = searchParams.get('city') || '';
  const lat = searchParams.get('lat') || '';
  const lng = searchParams.get('lng') || '';
  const [sort, setSort] = useState('rating');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filters, setFilters] = useState({});
  const [locating, setLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const { data: recData } = useQuery(
    ['recommend', q, city, lat, lng],
    () => recommendApi.get({ service: q, city: city || undefined, lat: lat || undefined, lng: lng || undefined }),
    { enabled: !!q }
  );

  const { data, isLoading } = useQuery(
    ['hospitals', q, city, lat, lng, sort],
    () => hospitalsApi.list({ city: city || undefined, service: q || undefined, lat: lat || undefined, lng: lng || undefined, sort, limit: 100 }),
    { enabled: true }
  );

  const hospitals = data?.hospitals || [];
  const recommendations = recData?.recommendations || [];

  const toggleFilter = (key) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  };

  let filtered = hospitals;
  FILTERS.forEach((f) => {
    if (filters[f.key]) filtered = filtered.filter((h) => h[f.key]);
  });

  const setNearbyFromBrowser = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setLocationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const params = new URLSearchParams(searchParams);
        params.set('lat', String(pos.coords.latitude));
        params.set('lng', String(pos.coords.longitude));
        if (!params.get('city')) params.set('city', 'Dehradun');
        setSearchParams(params);
        setLocating(false);
      },
      () => {
        setLocating(false);
        setLocationError('Location permission denied. Defaulting to Dehradun.');
        const params = new URLSearchParams(searchParams);
        if (!params.get('city')) params.set('city', 'Dehradun');
        setSearchParams(params);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex gap-6">
        <motion.aside
          className={cn(
            'w-64 flex-shrink-0 transition-all duration-300 hidden lg:block',
            !sidebarOpen && 'lg:w-0 lg:overflow-hidden lg:opacity-0'
          )}
          initial={false}
        >
          <div className="sticky top-24 space-y-4">
            <div className="glass-card p-4">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4" /> Filters
              </h3>
              {FILTERS.map((f) => (
                <label key={f.key} className="flex items-center gap-2 py-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!filters[f.key]}
                    onChange={() => toggleFilter(f.key)}
                    className="rounded border-slate-300 text-sky-500 focus:ring-sky-500"
                  />
                  <span className="text-sm">{f.label}</span>
                </label>
              ))}
            </div>
            <div className="glass-card p-4">
              <h3 className="font-semibold mb-2">Sort by</h3>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={cn(
                    'block w-full text-left py-2 px-3 rounded-lg text-sm transition-colors',
                    sort === opt.value
                      ? 'bg-sky-500/20 text-sky-600 dark:text-sky-400'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </motion.aside>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              {q ? `Results for "${q}"` : 'Hospitals & Labs'}
              {city && ` in ${city}`}
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative hidden sm:block">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Change city..."
                  value={city}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams);
                    if (e.target.value) {
                      params.set('city', e.target.value);
                    } else {
                      params.delete('city');
                    }
                    params.delete('lat');
                    params.delete('lng');
                    setSearchParams(params);
                  }}
                  className="pl-9 pr-4 py-2 bg-secondary border border-border/50 rounded-lg text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/20 w-40"
                />
              </div>
              <Button variant="outline" size="sm" onClick={setNearbyFromBrowser} disabled={locating}>
                <LocateFixed className="w-4 h-4 mr-1" />
                {locating ? 'Locating...' : 'Use my location'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mb-4 text-sm">
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-900/30"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('city', 'Dehradun');
                setSearchParams(params);
              }}
            >
              Dehradun
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-900/30"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('city', 'Delhi');
                setSearchParams(params);
              }}
            >
              Delhi
            </button>
            <button
              type="button"
              className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-sky-900/30"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set('city', 'Mumbai');
                setSearchParams(params);
              }}
            >
              Mumbai
            </button>
          </div>
          {locationError && <p className="text-sm text-amber-600 dark:text-amber-300 mb-4">{locationError}</p>}

          {recommendations.length > 0 && q && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">
                Smart recommendation (best score)
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendations.slice(0, 3).map((r) => (
                  <Link key={r._id} to={`/hospital/${r.slug}`}>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-800 dark:text-amber-200 text-sm">
                      {r.name} – Score {r.score}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.ul className="space-y-4" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}>
              <AnimatePresence mode="popLayout">
                {filtered.map((h) => {
                  const rec = recommendations.find((r) => r._id === h._id);
                  const svc = q ? h.services?.find((s) => new RegExp(q, 'i').test(s.name)) : h.services?.[0];
                  const price = svc?.price;
                  return (
                    <motion.li
                      key={h._id}
                      variants={listItemVariants}
                    >
                      <Link to={`/hospital/${h.slug}`}>
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
                          <CardContent className="p-0 flex flex-col sm:flex-row">
                            <div className="sm:w-48 h-32 sm:h-auto bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
                            <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold text-lg group-hover:text-sky-600 dark:group-hover:text-sky-400">
                                    {h.name}
                                  </h3>
                                  {h.verified && (
                                    <BadgeCheck className="w-5 h-5 text-sky-500" title="Verified" />
                                  )}
                                  {rec && (
                                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-medium">
                                      Best deal
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                  <MapPin className="w-4 h-4" /> {h.address}, {h.city}
                                </p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="flex items-center gap-1 text-sm">
                                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                    {h.rating || '\u2013'}
                                  </span>
                                  {price != null && (
                                    <span className="flex items-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400">
                                      <IndianRupee className="w-4 h-4" /> ₹{price}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link to={`/compare?add=${h.slug}`} onClick={(e) => e.stopPropagation()}>
                                  <Button variant="outline" size="sm">
                                    Compare
                                  </Button>
                                </Link>
                                <Link to={`/booking/${h.slug}`} onClick={(e) => e.stopPropagation()}>
                                  <Button size="sm" className="rounded-lg">Book</Button>
                                </Link>
                                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-sky-500" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </motion.ul>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500 glass-card">
              <p className="font-medium text-slate-700 dark:text-slate-200 mb-2">No matching hospitals right now</p>
              <p className="mb-4">Try another service term, remove filters, or switch city.</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFilters({})}>Clear filters</Button>
                <Button size="sm" onClick={setNearbyFromBrowser}>Search nearby</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
