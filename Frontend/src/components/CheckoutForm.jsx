import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsApi } from '../lib/api';
import toast from 'react-hot-toast';
import { useQueryClient } from 'react-query';

export default function CheckoutForm({ amount, onSuccess }) {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setMessage(error.message);
            toast.error(error.message);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            toast.success('Payment authorized via Stripe!');
            onSuccess(paymentIntent.id, 'card');
        } else {
            setMessage('Unexpected state.');
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />
            {message && <div className="text-rose-500 font-bold text-xs uppercase tracking-widest bg-rose-50 dark:bg-rose-900/10 p-3 rounded-xl border border-rose-100 dark:border-rose-800">{message}</div>}
            <button
                disabled={isLoading || !stripe || !elements}
                className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3 disabled:opacity-70 active:scale-95"
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    `Authorize ₹${amount}`
                )}
            </button>
        </form>
    );
}
