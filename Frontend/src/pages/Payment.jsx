import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion } from 'framer-motion';
import { bookingsApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export default function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [method, setMethod] = useState('upi');
  const [txnId, setTxnId] = useState('');
  const [paying, setPaying] = useState(false);

  const { data: booking, isLoading } = useQuery(
    ['booking', bookingId],
    () => bookingsApi.get(bookingId),
    { enabled: !!bookingId }
  );

  if (!user) {
    navigate('/login');
    return null;
  }

  if (isLoading || !booking) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-48 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  const handlePay = async () => {
    setPaying(true);
    try {
      const generatedTxnId = txnId || 'SIM_' + Date.now();
      await bookingsApi.pay(bookingId, { method, transactionId: generatedTxnId });
      
      // Show success alert
      alert(`Payment simulated successfully!\nMethod: ${method.toUpperCase()}\nTxn ID: ${generatedTxnId}`);
      
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'Payment failed');
    } finally {
      setPaying(false);
    }
  };


  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Payment
      </motion.h1>
      <Card className="mb-6">
        <CardContent className="p-6 space-y-2">
          <p><strong>Service:</strong> {booking.service?.name}</p>
          <p><strong>Hospital:</strong> {booking.hospital?.name}</p>
          <p><strong>Slot:</strong> {booking.slot?.date && new Date(booking.slot.date).toLocaleDateString()} {booking.slot?.startTime}–{booking.slot?.endTime}</p>
          <p className="text-xl font-bold text-sky-600 dark:text-sky-400">₹{booking.payment?.amount}</p>
        </CardContent>
      </Card>
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-3">Payment method (simulation)</h3>
          <div className="space-y-2">
            {['upi', 'card'].map((m) => (
              <label key={m} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="method"
                  value={m}
                  checked={method === m}
                  onChange={() => setMethod(m)}
                  className="text-sky-500"
                />
                <span className="capitalize">{m}</span>
              </label>
            ))}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Transaction ID (optional)"
                value={txnId}
                onChange={(e) => setTxnId(e.target.value)}
                className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handlePay} disabled={paying} className="flex-1">
          {paying ? 'Processing...' : 'Pay now'}
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          My bookings
        </Button>
      </div>
      {booking.status === 'confirmed' && (
        <p className="mt-4 text-sm text-slate-500">
          <Link to="/dashboard" className="text-sky-600 underline">Go to Dashboard</Link> to download invoice.
        </p>
      )}
    </div>
  );
}
