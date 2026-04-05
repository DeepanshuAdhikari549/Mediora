import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import axios from 'axios';

// Initialize Stripe outside of component
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripePayment({ amount, onSuccess }) {
    const [clientSecret, setClientSecret] = useState("");
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        const token = localStorage.getItem('token');

        // Check if key is available or is a placeholder
        if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder') {
            console.log("Running in demo mode without Stripe.");
            return;
        }

        axios.post(`${API_URL}/api/payments/create-payment-intent`,
            { amount },
            { headers: { Authorization: `Bearer ${token}` } }
        )
            .then((res) => setClientSecret(res.data.clientSecret))
            .catch(err => console.error("Error creating payment intent:", err));
    }, [amount, API_URL]);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0d9488',
            colorBackground: '#ffffff',
            colorText: '#0f172a',
            fontFamily: 'Plus Jakarta Sans, Inter, system-ui, sans-serif',
            borderRadius: '16px',
            spacingGridRow: '20px',
        },
        rules: {
            '.Input': {
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
            },
            '.Input:focus': {
                border: '1px solid #0d9488',
                boxShadow: '0 0 0 4px rgba(13, 148, 136, 0.1)',
            }
        }
    };
    const options = {
        clientSecret,
        appearance,
    };

    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY === 'pk_test_placeholder') {
        return (
            <div className="flex flex-col space-y-4">
                <div className="p-6 bg-amber-50 dark:bg-amber-900/10 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-800 text-sm font-bold">
                    Payment Gateway is currently in Demo mode. No real payment required.
                </div>
                <button
                    type="button"
                    onClick={() => onSuccess('demo_payment_' + Date.now(), 'demo_mode')}
                    className="w-full h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-teal-500/30 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                    Complete Booking
                </button>
            </div>
        );
    }

    return (
        <div className="w-full">
            {clientSecret ? (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm amount={amount} onSuccess={onSuccess} />
                </Elements>
            ) : (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                    <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-600 rounded-full animate-spin"></div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Initializing Gateway...</span>
                </div>
            )}
        </div>
    );
}
