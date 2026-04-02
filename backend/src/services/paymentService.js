import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const paymentService = {
    /**
     * Create a payment intent
     */
    async createPaymentIntent(amount, currency = 'inr', metadata = {}) {
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to smallest currency unit (paise)
                currency,
                metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id,
            };
        } catch (error) {
            console.error('Payment intent creation error:', error);
            throw new Error('Failed to create payment intent');
        }
    },

    /**
     * Verify payment status
     */
    async verifyPayment(paymentIntentId) {
        try {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            return {
                status: paymentIntent.status,
                amount: paymentIntent.amount / 100,
                currency: paymentIntent.currency,
                metadata: paymentIntent.metadata,
            };
        } catch (error) {
            console.error('Payment verification error:', error);
            throw new Error('Failed to verify payment');
        }
    },

    /**
     * Create a refund
     */
    async createRefund(paymentIntentId, amount = null) {
        try {
            const refund = await stripe.refunds.create({
                payment_intent: paymentIntentId,
                amount: amount ? Math.round(amount * 100) : undefined,
            });

            return {
                refundId: refund.id,
                status: refund.status,
                amount: refund.amount / 100,
            };
        } catch (error) {
            console.error('Refund error:', error);
            throw new Error('Failed to create refund');
        }
    },

    /**
     * Verify webhook signature
     */
    verifyWebhookSignature(payload, signature) {
        try {
            const event = stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
            return event;
        } catch (error) {
            console.error('Webhook verification error:', error);
            throw new Error('Invalid webhook signature');
        }
    },
};
