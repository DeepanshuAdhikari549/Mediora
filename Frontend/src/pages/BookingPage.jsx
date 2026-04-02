import { useState } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalsApi, bookingsApi } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import StripePayment from '../components/StripePayment';

export default function BookingPage() {
  const { hospitalSlug } = useParams();
  const [searchParams] = useSearchParams();
  const preService = searchParams.get('service') || '';
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [service, setService] = useState(preService);
  const [slot, setSlot] = useState({ date: '', startTime: '', endTime: '' });
  const [homeSample, setHomeSample] = useState(false);
  const [address, setAddress] = useState('');
  
  const [stage, setStage] = useState('select'); // 'select' or 'pay'
  const [method, setMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data: hospital, isLoading } = useQuery(
    ['hospital', hospitalSlug],
    () => hospitalsApi.get(hospitalSlug),
    { enabled: !!hospitalSlug }
  );

  if (!user) {
    navigate('/login?redirect=' + encodeURIComponent('/booking/' + hospitalSlug));
    return null;
  }

  if (isLoading || !hospital) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
      </div>
    );
  }

  const selectedSvc = hospital.services?.find((s) => s.name === service) || hospital.services?.[0];
  const slotOptions = hospital.slots?.filter((s) => s.available) || [
    { date: new Date(), startTime: '09:00', endTime: '10:00' },
    { date: new Date(), startTime: '10:00', endTime: '11:00' },
    { date: new Date(), startTime: '14:00', endTime: '15:00' },
  ];

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!selectedSvc || !slot.date || !slot.startTime) return alert('Please select a valid service and slot.');
    if (homeSample && !address) return alert('Please enter your address for home sample collection.');
    setStage('pay');
  };

  const handlePaymentSuccess = async (transactionId, paymentMethod) => {
    setSubmitting(true);
    try {
      await bookingsApi.create({
        hospitalId: hospital._id,
        service: { name: selectedSvc.name, category: selectedSvc.category, price: selectedSvc.price },
        slot: {
          date: new Date(slot.date).toISOString(),
          startTime: slot.startTime,
          endTime: slot.endTime || slot.startTime.replace(/(\d+):(\d+)/, (_, h, m) => `${Number(h) + 1}:${m}`),
        },
        homeSample,
        address: homeSample ? address : undefined,
        method: paymentMethod,
        transactionId
      });
      alert(`Booking Successful! Payment authorized.\nMethod: ${paymentMethod.toUpperCase()}`);
      navigate(`/dashboard`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create booking after payment.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpiPay = () => {
      if (!upiId) return alert('Please enter your UPI ID');
      // Execute payment logic
      handlePaymentSuccess(upiId, 'upi');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <motion.h1
        className="text-2xl font-bold mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Book at {hospital.name}
      </motion.h1>

      <AnimatePresence mode="wait">
        {stage === 'select' && (
          <motion.form 
            key="select"
            onSubmit={handleDetailsSubmit}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Service</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3"
                    required
                  >
                    {hospital.services?.map((s, i) => (
                      <option key={i} value={s.name}>
                        {s.name} – ₹{s.price}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time slot</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {slotOptions.slice(0, 6).map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setSlot({
                            date: s.date instanceof Date ? s.date.toISOString().slice(0, 10) : new Date(s.date).toISOString().slice(0, 10),
                            startTime: s.startTime,
                            endTime: s.endTime,
                          })
                        }
                        className={`py-2 px-3 rounded-lg border text-sm ${
                          slot.startTime === s.startTime
                            ? 'border-sky-500 bg-sky-500/20 text-sky-700 dark:text-sky-300'
                            : 'border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        {s.startTime}–{s.endTime}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2">
                    <label className="text-sm text-slate-500">Date</label>
                    <Input
                      type="date"
                      value={slot.date}
                      onChange={(e) => setSlot((prev) => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={homeSample}
                    onChange={(e) => setHomeSample(e.target.checked)}
                    className="rounded border-slate-300 text-sky-500"
                  />
                  <span className="text-sm">Home sample collection</span>
                </label>
                {homeSample && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Address for sample collection</label>
                    <Input
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter Full Address"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">
                Amount: ₹{selectedSvc?.price || 0}
              </p>
              <Button type="submit">
                Proceed to pay
              </Button>
            </div>
          </motion.form>
        )}

        {stage === 'pay' && (
          <motion.div
            key="pay"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <Card className="mb-6">
                <CardContent className="p-6 space-y-2">
                    <p><strong>Service:</strong> {selectedSvc?.name}</p>
                    <p><strong>Hospital:</strong> {hospital.name}</p>
                    <p><strong>Slot:</strong> {new Date(slot.date).toLocaleDateString()} {slot.startTime}</p>
                    <p className="text-xl font-bold text-sky-600 dark:text-sky-400">Total: ₹{selectedSvc?.price}</p>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Complete Payment to Confirm</h3>
                <div className="flex gap-4 mb-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="method" value="upi" checked={method === 'upi'} onChange={() => setMethod('upi')} className="text-sky-500" />
                        <span>UPI Express</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="method" value="card" checked={method === 'card'} onChange={() => setMethod('card')} className="text-sky-500" />
                        <span>Credit/Debit Card (Stripe)</span>
                    </label>
                </div>
                
                {method === 'upi' ? (
                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Enter your UPI ID to simulate a real payment confirmation.</p>
                        <Input 
                            placeholder="e.g. username@okhdfcbank" 
                            value={upiId} 
                            onChange={e => setUpiId(e.target.value)}
                        />
                        <Button 
                            className="w-full" 
                            onClick={handleUpiPay} 
                            disabled={submitting}
                        >
                            {submitting ? 'Confirming...' : `Pay ₹${selectedSvc?.price} via UPI`}
                        </Button>
                    </div>
                ) : (
                    <div>
                        <StripePayment amount={selectedSvc?.price || 0} onSuccess={handlePaymentSuccess} />
                    </div>
                )}
                </CardContent>
            </Card>

            <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStage('select')}>
                    Back to Details
                </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
