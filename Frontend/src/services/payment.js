import { loadStripe } from '@stripe/stripe-js';

const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

let stripePromise;

/**
 * Initialize Stripe
 */
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_PUBLIC_KEY);
    }
    return stripePromise;
};

/**
 * Create payment intent on backend
 */
export const createPaymentIntent = async (bookingId, amount) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/payments/create-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, amount }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment intent');
    }

    return response.json();
};

/**
 * Verify payment on backend
 */
export const verifyPayment = async (paymentIntentId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/payments/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentIntentId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to verify payment');
    }

    return response.json();
};

/**
 * Get payment details
 */
export const getPaymentDetails = async (paymentId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/payments/${paymentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get payment details');
    }

    return response.json();
};

/**
 * Request refund
 */
export const requestRefund = async (paymentId) => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');

    const response = await fetch(`${apiUrl}/api/payments/${paymentId}/refund`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to request refund');
    }

    return response.json();
};
