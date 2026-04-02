import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IndianRupee, Star, MapPin, Trash2 } from 'lucide-react';
import { hospitalsApi } from '../lib/api';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const addId = searchParams.get('add');
  const [slugs, setSlugs] = useState(() => {
    const stored = localStorage.getItem('compareSlugs');
    return stored ? JSON.parse(stored) : [];
  });
  const [hospitals, setHospitals] = useState([]);

  useEffect(() => {
    if (addId && !slugs.includes(addId)) {
      const next = [...slugs, addId].slice(-3);
      setSlugs(next);
      localStorage.setItem('compareSlugs', JSON.stringify(next));
    }
  }, [addId]);

  useEffect(() => {
    if (slugs.length === 0) {
      setHospitals([]);
      return;
    }
    Promise.all(slugs.map((s) => hospitalsApi.get(s).catch(() => null))).then((results) => {
      setHospitals(results.filter(Boolean));
    });
  }, [slugs.join(',')]);

  const remove = (slug) => {
    const next = slugs.filter((x) => x !== slug);
    setSlugs(next);
    localStorage.setItem('compareSlugs', JSON.stringify(next));
  };

  const getServicePrice = (h, serviceName) => {
    const s = h.services?.find((x) => new RegExp(serviceName, 'i').test(x.name));
    return s ? s.price : '–';
  };

  const serviceNames = [...new Set(hospitals.flatMap((h) => (h.services || []).map((s) => s.name)))].slice(0, 10);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Compare hospitals
      </motion.h1>
      {hospitals.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-slate-500 mb-4">
            Add hospitals from search or detail page to compare (max 3).
          </p>
          <Link to="/search">
            <Button>Search hospitals</Button>
          </Link>
        </Card>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="overflow-x-auto"
        >
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-4 border-b border-slate-200 dark:border-slate-700 font-semibold w-40">
                  Feature
                </th>
                {hospitals.map((h) => (
                  <th key={h._id} className="p-4 border-b border-slate-200 dark:border-slate-700 min-w-[200px]">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link to={`/hospital/${h.slug}`} className="font-semibold hover:text-sky-600">
                          {h.name}
                        </Link>
                        <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" /> {h.city}
                        </p>
                      </div>
                      <button
                        onClick={() => remove(h.slug)}
                        className="p-1 rounded text-slate-400 hover:text-red-500"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="p-4 font-medium">Rating</td>
                {hospitals.map((h) => (
                  <td key={h._id} className="p-4 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    {h.rating || '–'}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                <td className="p-4 font-medium">Address</td>
                {hospitals.map((h) => (
                  <td key={h._id} className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {h.address}, {h.city}
                  </td>
                ))}
              </tr>
              {serviceNames.map((name) => (
                <tr key={name} className="border-b border-slate-100 dark:border-slate-700/50">
                  <td className="p-4 font-medium">{name}</td>
                  {hospitals.map((h) => (
                    <td key={h._id} className="p-4">
                      {getServicePrice(h, name) !== '–' ? (
                        <span className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" /> ₹{getServicePrice(h, name)}
                        </span>
                      ) : (
                        '–'
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 flex gap-3">
            {hospitals.map((h) => (
              <Link key={h._id} to={`/booking/${h.slug}`}>
                <Button size="sm">Book {h.name}</Button>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
