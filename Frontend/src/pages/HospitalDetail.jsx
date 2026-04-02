import { useParams, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { MapPin, Star, Phone, BadgeCheck, IndianRupee, Calendar } from 'lucide-react';
import { hospitalsApi, reviewsApi } from '../lib/api';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export default function HospitalDetail() {
  const { slug } = useParams();
  const { data: hospital, isLoading } = useQuery(
    ['hospital', slug],
    () => hospitalsApi.get(slug),
    { enabled: !!slug }
  );
  const { data: reviews } = useQuery(
    ['reviews', hospital?._id],
    () => reviewsApi.list(hospital._id),
    { enabled: !!hospital?._id }
  );

  if (isLoading || !hospital) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-6" />
        <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-4">
            <h1 className="text-3xl font-bold">{hospital.name}</h1>
            {hospital.verified && <BadgeCheck className="w-8 h-8 text-sky-500 flex-shrink-0" />}
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">{hospital.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              {hospital.rating || '–'} ({hospital.reviewCount} reviews)
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {hospital.address}, {hospital.city}
            </span>
            {hospital.phone && (
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4" /> {hospital.phone}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {hospital.nablCertified && (
              <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs">
                NABL
              </span>
            )}
            {hospital.insuranceSupported && (
              <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-700 dark:text-blue-300 text-xs">
                Insurance
              </span>
            )}
            {hospital.homeSampleCollection && (
              <span className="px-2 py-1 rounded bg-violet-500/20 text-violet-700 dark:text-violet-300 text-xs">
                Home sample
              </span>
            )}
          </div>
          <div className="mt-6 flex gap-3">
            <Link to={`/booking/${slug}`}>
              <Button>Book appointment</Button>
            </Link>
            <Button variant="outline" asChild>
              <Link to={`/compare?add=${hospital.slug}`}>Add to compare</Link>
            </Button>
          </div>
        </div>
        <div className="w-full lg:w-96 h-64 lg:h-80 rounded-2xl bg-slate-200 dark:bg-slate-700 flex-shrink-0" />
      </motion.div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-10"
      >
        <h2 className="text-xl font-bold mb-4">Price list & services</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left p-4 font-semibold">Service</th>
                    <th className="text-left p-4 font-semibold">Category</th>
                    <th className="text-right p-4 font-semibold">Price</th>
                    <th className="p-4" />
                  </tr>
                </thead>
                <tbody>
                  {(hospital.services || []).map((s, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50">
                      <td className="p-4">{s.name}</td>
                      <td className="p-4 text-slate-500">{s.category}</td>
                      <td className="p-4 text-right font-medium flex items-center justify-end gap-1">
                        <IndianRupee className="w-4 h-4" /> ₹{s.price}
                      </td>
                      <td className="p-4">
                        <Link to={`/booking/${slug}?service=${encodeURIComponent(s.name)}`}>
                          <Button size="sm">Book</Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-10"
      >
        <h2 className="text-xl font-bold mb-4">Reviews</h2>
        <div className="space-y-3">
          {(reviews || []).slice(0, 10).map((r) => (
            <Card key={r._id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{r.rating}</span>
                  <span className="text-slate-500 text-sm">{r.user?.name}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{r.comment || '–'}</p>
              </CardContent>
            </Card>
          ))}
          {(!reviews || reviews.length === 0) && (
            <p className="text-slate-500">No reviews yet.</p>
          )}
        </div>
      </motion.section>
    </div>
  );
}
