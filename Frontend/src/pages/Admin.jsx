import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { adminApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

export default function Admin() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { data: stats } = useQuery(['admin-stats', user?.id], adminApi.stats, { enabled: user?.role === 'admin' });
  const { data: analytics } = useQuery(['admin-analytics', user?.id], adminApi.bookingsAnalytics, { enabled: user?.role === 'admin' });
  const { data: hospitals = [] } = useQuery(['admin-hospitals', user?.id], adminApi.hospitals, { enabled: user?.role === 'admin' });
  const { data: adminBookings = [] } = useQuery(['admin-bookings-list', user?.id], adminApi.bookings, { enabled: user?.role === 'admin' });

  if (user?.role !== 'admin') {
    navigate('/');
    return null;
  }

  const byDay = (analytics?.byDay || []).map((d) => ({ date: d._id, count: d.count }));
  const byStatus = (analytics?.byStatus || []).map((d) => ({ name: d._id, value: d.count }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard
      </motion.h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Hospitals</p>
            <p className="text-2xl font-bold">{stats?.hospitals ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Total bookings</p>
            <p className="text-2xl font-bold">{stats?.bookings ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Users</p>
            <p className="text-2xl font-bold">{stats?.users ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-slate-500">Bookings (7 days)</p>
            <p className="text-2xl font-bold">{stats?.recentBookings ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Bookings by day (last 30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay}>
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bookings by status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={byStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {byStatus.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hospitals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">City</th>
                  <th className="text-left p-3">Verified</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {hospitals.map((h) => (
                  <tr key={h._id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="p-3">{h.name}</td>
                    <td className="p-3">{h.city}</td>
                    <td className="p-3">{h.verified ? 'Yes' : 'No'}</td>
                    <td className="p-3">
                      {!h.verified && (
                        <Button
                          size="sm"
                          onClick={async () => {
                            await adminApi.verifyHospital(h._id);
                            window.location.reload();
                          }}
                        >
                          Verify
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Manage Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left p-3">Patient</th>
                  <th className="text-left p-3">Hospital</th>
                  <th className="text-left p-3">Service</th>
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Method</th>
                  <th className="text-left p-3">Status</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {adminBookings.map((b) => (
                  <tr key={b._id} className="border-b border-slate-100 dark:border-slate-700/50">
                    <td className="p-3">{b.user?.name}</td>
                    <td className="p-3">{b.hospital?.name}</td>
                    <td className="p-3">{b.service?.name} (₹{b.payment?.amount})</td>
                    <td className="p-3 whitespace-nowrap">
                        {b.slot?.date ? new Date(b.slot.date).toLocaleDateString() : 'N/A'} {b.slot?.startTime}
                    </td>
                    <td className="p-3 capitalize">
                       {b.payment?.method || 'N/A'} {b.payment?.paid ? '✓' : ''}
                    </td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={async (e) => {
                          const status = e.target.value;
                          await adminApi.updateBookingStatus(b._id, status);
                          window.location.reload();
                        }}
                        className="py-1 px-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 rounded text-xs focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-3">
                    </td>
                  </tr>
                ))}
                {adminBookings.length === 0 && (
                    <tr>
                        <td colSpan="7" className="p-4 text-center text-slate-500">No bookings found.</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
