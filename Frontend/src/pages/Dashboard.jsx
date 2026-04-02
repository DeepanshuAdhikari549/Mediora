import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { Calendar, Download, Heart, FileText } from 'lucide-react';
import { bookingsApi, authApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { getToken } from '../lib/utils';

function downloadInvoice(bookingId) {
  const token = getToken();
  if (!token) return;
  fetch(`${import.meta.env.VITE_API_URL || ''}/api/invoice/${bookingId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((r) => r.blob())
    .then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `medicompare-invoice-${bookingId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    })
    .catch(() => alert('Download failed'));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: userData } = useQuery(['user', user?.id], authApi.me, { enabled: !!user });
  const { data: bookings = [], isLoading } = useQuery(['bookings', user?.id], bookingsApi.list, { enabled: !!user });

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Dashboard
      </motion.h1>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-sky-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">My bookings</p>
              <p className="text-2xl font-bold">{bookings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Saved hospitals</p>
              <p className="text-2xl font-bold">{userData?.savedHospitals?.length ?? 0}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold mb-4">Recent bookings</h2>
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.slice(0, 10).map((b) => (
            <Card key={b._id}>
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{b.service?.name} at {b.hospital?.name}</p>
                  <p className="text-sm text-slate-500">
                    {b.slot?.date && new Date(b.slot.date).toLocaleDateString()} {b.slot?.startTime} – {b.status}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">₹{b.payment?.amount}</span>
                  {b.status === 'confirmed' && (
                    <button
                      type="button"
                      onClick={() => downloadInvoice(b._id)}
                      className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="Download invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        if (confirm('Cancel this booking?')) {
                          await bookingsApi.cancel(b._id);
                          window.location.reload();
                        }
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {bookings.length === 0 && (
            <p className="text-slate-500">No bookings yet. <Link to="/search" className="text-sky-600 underline">Search & book</Link></p>
          )}
        </div>
      )}
    </div>
  );
}
