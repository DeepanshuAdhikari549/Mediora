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

        // Check if key is available
        if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
            console.error("Stripe Publishable Key is missing");
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

    if (!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) {
        return (
            <div className="p-6 bg-rose-50 dark:bg-rose-900/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-100 dark:border-rose-800 text-sm font-bold">
                Payment Gateway Configuration Error: Stripe Public Key is missing.
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
