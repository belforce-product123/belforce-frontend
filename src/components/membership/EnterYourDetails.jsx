import { useMemo, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/apiClient';
import { env } from '../../utils/env';
import { loadRazorpayCheckout } from '../../utils/razorpay';

const INDIA_COUNTRY_CODE = '+91';
const DISALLOWED_EMAIL_DOMAINS = new Set([
  'example.com',
  'example.org',
  'example.net',
  'test.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
]);

const USE_OPTIONS = [
  { value: 'seller', label: 'Seller', desc: 'Sell used electronics faster' },
  { value: 'buyer', label: 'Buyer', desc: 'Buy verified items with confidence' },
];

function EnterYourDetails() {
  const [searchParams] = useSearchParams();
  const planRaw = searchParams.get('plan');
  const plan = planRaw === 'pro' || planRaw === 'promax' || planRaw === 'dummy_plan' ? planRaw : 'pro';
  const choosePlanHref = `/membership-plans/choose-plan?plan=${plan}`;

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    useType: 'seller',
  });
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [existingMembership, setExistingMembership] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (value) => {
    const email = String(value || '').trim().toLowerCase();
    // Basic sanity checks: one @, non-empty parts, and a reasonable domain structure.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return false;
    if (email.includes('..')) return false;

    const [, domain = ''] = email.split('@');
    if (!domain || domain.startsWith('.') || domain.endsWith('.')) return false;
    if (DISALLOWED_EMAIL_DOMAINS.has(domain)) return false;

    // Block obvious placeholders like "test@" or "fake@" in the local-part.
    const local = email.split('@')[0] || '';
    if (/^(test|fake|demo|sample|example)\b/.test(local)) return false;

    return true;
  };

  const planSummary = useMemo(() => {
    if (plan === 'dummy_plan') {
      return {
        badge: 'Test',
        name: 'Dummy Plan (Test)',
        price: '1 / test',
        bullets: ['Use this to verify payment + redirect + email end-to-end.'],
      };
    }
    if (plan === 'pro') {
      return {
        badge: null,
        name: 'BelForce Pro Plan',
        price: '699 / lifetime',
        bullets: [
          'Access to standard seller tools',
          'Standard visibility & chat access',
          'Basic electronics valuation',
          'Standard pickup options',
        ],
      };
    }
    return {
      badge: 'Best Value',
      name: 'BelForce Pro Max Plan',
      price: '1599 / year',
      bullets: [
        'Access to premium buyer tools',
        'Priority support & faster transactions',
        'Exclusive seller insights & analytics',
        'No listing fees on first 20 items',
      ],
    };
  }, [plan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => {
      if (!prev?.[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const validate = () => {
    const errors = {};

    const fullName = String(form.fullName || '').trim();
    const phoneRaw = String(form.phone || '').trim();
    const phoneDigits = phoneRaw.replace(/\D/g, '');
    const email = String(form.email || '').trim();
    const address = String(form.address || '').trim();
    const useType = String(form.useType || '').trim();

    if (fullName.length < 2) errors.fullName = 'Full name is required';
    if (phoneDigits.length !== 10) errors.phone = 'Enter a valid 10-digit Indian mobile number';
    if (!validateEmail(email)) errors.email = 'Enter a valid, genuine email address';
    if (address.length < 5) errors.address = 'Address is required';
    if (!useType) errors.useType = 'Please select how you will use BelForce';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPay = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!validate()) return;

    try {
      setSaving(true);
      setSubmitError('');
      setExistingMembership(null);

      const phoneDigits = String(form.phone || '').replace(/\D/g, '').slice(-10);
      const phoneE164 = `${INDIA_COUNTRY_CODE}${phoneDigits}`;

      const result = await apiFetch('/memberships/registrations', {
        method: 'POST',
        body: JSON.stringify({
          plan,
          ...form,
          phone: phoneE164,
        }),
      });

      const order = await apiFetch('/payments/razorpay/order', {
        method: 'POST',
        body: JSON.stringify({ registrationId: result.id }),
      });

      const ok = await loadRazorpayCheckout();
      if (!ok) throw new Error('Failed to load Razorpay. Please try again.');

      const key = env.razorpayKeyId || order.keyId;
      if (!key) throw new Error('Missing Razorpay Key ID (set VITE_RAZORPAY_KEY_ID)');

      const rz = new window.Razorpay({
        key,
        amount: order.amount,
        currency: order.currency,
        name: 'BelForce',
        description: `Membership payment (${plan})`,
        order_id: order.orderId,
        prefill: {
          name: form.fullName,
          email: form.email,
          contact: phoneE164,
        },
        notes: {
          membershipId: order.membershipId,
          registrationId: order.registrationId,
          plan: order.plan,
        },
        handler: async (response) => {
          try {
            await apiFetch('/payments/razorpay/verify', {
              method: 'POST',
              body: JSON.stringify({
                registrationId: result.id,
                ...response,
              }),
            });

            navigate(`/membership-plans/payment-success?plan=${plan}`, {
              state: { fullName: form.fullName || 'Member', membershipId: result.membershipId },
            });
          } catch (err) {
            setSubmitError(err?.message || 'Payment verification failed. Please contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setSubmitError('Payment cancelled. You can try again.');
          },
        },
        theme: { color: '#111827' },
      });

      rz.open();
    } catch (err) {
      if (err?.status === 409 && err?.data?.existing) {
        setExistingMembership(err.data.existing);
        return;
      }
      setSubmitError(err?.message || 'Failed to save your details. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const existingPlanLabel =
    existingMembership?.plan === 'dummy_plan'
      ? 'Dummy Plan (Test)'
      : existingMembership?.plan === 'promax'
        ? 'BelForce Pro Max Plan'
        : 'BelForce Pro Plan';

  return (
    <div className="enter-details">
      {existingMembership ? (
        <div
          className="enter-details__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="existing-membership-title"
          onClick={() => setExistingMembership(null)}
        >
          <div className="enter-details__modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="enter-details__modal-badge">Already Active</div>
            <h2 id="existing-membership-title" className="enter-details__modal-title">
              Membership already exists
            </h2>
            <p className="enter-details__modal-text">
              We found a <strong>paid</strong> membership for <strong>{existingMembership.email}</strong>.
            </p>

            <div className="enter-details__modal-summary">
              <div className="enter-details__modal-row">
                <span>Plan</span>
                <strong>{existingPlanLabel}</strong>
              </div>
              <div className="enter-details__modal-row">
                <span>Membership ID</span>
                <strong>{existingMembership.membershipId}</strong>
              </div>
            </div>

            <div className="enter-details__modal-actions">
              <button type="button" className="enter-details__modal-btn enter-details__modal-btn--ghost" onClick={() => setExistingMembership(null)}>
                Close
              </button>
              <button
                type="button"
                className="enter-details__modal-btn"
                onClick={() => {
                  navigate(`/membership-plans/payment-success?plan=${existingMembership.plan}`, {
                    state: {
                      fullName: existingMembership.fullName || form.fullName || 'Member',
                      membershipId: existingMembership.membershipId,
                    },
                  });
                }}
              >
                View membership
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <nav className="enter-details__nav">
        <Link to={choosePlanHref} className="enter-details__back" aria-label="Back to plan">
          ‹ <span className="enter-details__back-text">Back to Plan</span>
        </Link>
        <h1 className="enter-details__nav-title">Enter Your Details</h1>
      </nav>

      <div className="enter-details__layout">
        <div className="enter-details__card">
          <h2 className="enter-details__heading">Personal Information</h2>

        <div className="enter-details__field">
          <label htmlFor="fullName" className="enter-details__label">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            className="enter-details__input"
            required
          />
          {fieldErrors.fullName ? (
            <span role="alert" style={{ display: 'block', marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
              {fieldErrors.fullName}
            </span>
          ) : null}
        </div>

        <div className="enter-details__field">
          <label htmlFor="phone" className="enter-details__label">Phone Number</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div
              aria-hidden
              style={{
                minWidth: 64,
                height: 44,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
                borderRadius: 10,
                border: '1px solid rgba(15, 23, 42, 0.15)',
                background: '#f8fafc',
                fontWeight: 800,
                color: '#0f172a',
              }}
            >
              {INDIA_COUNTRY_CODE}
            </div>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={(e) => {
                const digits = String(e.target.value || '').replace(/\D/g, '').slice(0, 10);
                handleChange({ target: { name: 'phone', value: digits } });
              }}
              className="enter-details__input"
              maxLength={10}
              required
            />
          </div>
          <span className="enter-details__helper">India numbers only. We’ll save it as {INDIA_COUNTRY_CODE}XXXXXXXXXX.</span>
          {fieldErrors.phone ? (
            <span role="alert" style={{ display: 'block', marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
              {fieldErrors.phone}
            </span>
          ) : null}
        </div>

        <div className="enter-details__field">
          <label htmlFor="email" className="enter-details__label">Email ID</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="name@gmail.com"
            value={form.email}
            onChange={handleChange}
            className="enter-details__input"
            required
          />
          <span className="enter-details__helper">Used for updates & membership confirmation.</span>
          {fieldErrors.email ? (
            <span role="alert" style={{ display: 'block', marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
              {fieldErrors.email}
            </span>
          ) : null}
        </div>

        <div className="enter-details__field">
          <label htmlFor="address" className="enter-details__label">Address</label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="456 Oak Ave, Cityville, State 12345"
            value={form.address}
            onChange={handleChange}
            className="enter-details__input"
            required
          />
          <span className="enter-details__helper">For service-related use.</span>
          {fieldErrors.address ? (
            <span role="alert" style={{ display: 'block', marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
              {fieldErrors.address}
            </span>
          ) : null}
        </div>

        <div className="enter-details__section">
          <h3 className="enter-details__section-heading">How will you mainly use BelForce?</h3>
          <p className="enter-details__section-helper">This helps us personalize your experience.</p>
          <div className="enter-details__radio-group">
            {USE_OPTIONS.map((opt) => (
              <label key={opt.value} className="enter-details__radio-label">
                <input
                  type="radio"
                  name="useType"
                  value={opt.value}
                  checked={form.useType === opt.value}
                  onChange={handleChange}
                  className="enter-details__radio"
                  required
                />
                <div className="enter-details__radio-copy">
                  <span className="enter-details__radio-text">{opt.label}</span>
                  <span className="enter-details__radio-desc">{opt.desc}</span>
                </div>
              </label>
            ))}
          </div>
          {fieldErrors.useType ? (
            <span role="alert" style={{ display: 'block', marginTop: 6, color: '#dc2626', fontWeight: 600 }}>
              {fieldErrors.useType}
            </span>
          ) : null}
        </div>

        <p className="enter-details__secure">
          Your data is 100% secure and protected
          <span className="enter-details__secure-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </span>
        </p>

        <div className="enter-details__actions">
          <button type="button" className="enter-details__submit" onClick={handleContinueToPay} disabled={saving}>
            {saving ? 'Saving...' : 'Continue to Pay'}
          </button>
          <span className="enter-details__save">Save for later</span>
        </div>
        {submitError ? (
          <p role="alert" style={{ marginTop: 12, color: '#dc2626', fontWeight: 600 }}>
            {submitError}
          </p>
        ) : null}
      </div>

        <aside className="enter-details__summary" aria-label="Selected Plan Summary">
          {planSummary.badge ? <div className="enter-details__summary-badge">{planSummary.badge}</div> : null}
          <h3 className="enter-details__summary-title">Selected Plan Summary</h3>
          <div className="enter-details__summary-plan">{planSummary.name}</div>
          <div className="enter-details__summary-price">{planSummary.price}</div>

          <div className="enter-details__summary-section">What you get:</div>
          <ul className="enter-details__summary-list">
            {planSummary.bullets.map((b) => (
              <li key={b} className="enter-details__summary-item">
                <span className="enter-details__summary-check" aria-hidden>✓</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <Link to={choosePlanHref} className="enter-details__edit">Edit Plan</Link>

          <div className="enter-details__summary-divider" />

          <div className="enter-details__razor">
            <span className="enter-details__lock" aria-hidden>🔒</span>
            <span>Secure Payment via</span>
            <span className="enter-details__razorpay">Razorpay</span>
          </div>
          <button type="button" className="enter-details__support">
            Contact Support
          </button>
        </aside>
      </div>

      <p className="enter-details__copyright">copyright 2026 - BelForce</p>
    </div>
  );
}

export default EnterYourDetails;
