# MediCompare Project API Keys

To run the MediCompare application fully, you need to configure the following API keys in your environment variables.

## 1. Stripe API Keys (For Payments)
You need a Stripe account to process payments.
- **Sign up**: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
- **Get Keys**: Go to Developers > API Keys.

**Required Keys:**
- `STRIPE_SECRET_KEY` (Backend): Starts with `sk_test_...`
- `VITE_STRIPE_PUBLISHABLE_KEY` (Frontend): Starts with `pk_test_...`

**Where to put them:**
- **Backend (`backend/.env`)**:
  ```env
  STRIPE_SECRET_KEY=sk_test_your_secret_key
  ```
- **Frontend (`frontend/.env`)**:
  ```env
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
  ```

## 2. Google Maps API Key (For Location & Geocoding)
You need a Google Cloud Project with Billing enabled (it has a free tier).
- **Console**: [https://console.cloud.google.com/](https://console.cloud.google.com/)
- **Enable APIs**:
  - Maps JavaScript API
  - Geocoding API
  - Places API
- **Get Key**: IAM & Admin > Credentials > Create Credentials > API Key.

**Required Key:**
- `GOOGLE_MAPS_API_KEY` (Both Backend & Frontend)

**Where to put them:**
- **Backend (`backend/.env`)**:
  ```env
  GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```
- **Frontend (`frontend/.env`)**:
  ```env
  VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```

---

## checklist
- [ ] Backend `.env` updated
- [ ] Frontend `.env` updated
- [ ] Backend server restarted (`npm run server`)
- [ ] Frontend server restarted (`npm run dev`)
