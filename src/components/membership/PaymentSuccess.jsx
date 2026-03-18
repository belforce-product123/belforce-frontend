import { useMemo } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import womenImg from '../../assets/images/women.webp';

const PLAN_CONFIG = {
  pro: { title: 'BelForce Pro' },
  promax: { title: 'BelForce Pro Max' },
  dummy_plan: { title: 'Dummy Plan (Test)' },
};

const BENEFITS = [
  'Priority listing visibility — your items appear higher so they sell faster.',
  'No pickup charges for this account — doorstep pickup is included.',
  'Lower platform fees — more money stays with you on every sale.',
  'Faster buyer matching — we connect you to verified buyers quickly.',
  'Priority chat & support — quicker help when you need it.',
  'Early access to deals & new features.',
];

const WHATS_NEXT = [
  "You'll receive a confirmation message or email shortly",
  'App access and services activate from April 10, 2026',
  'Log in using your phone number and membership ID',
  'Your benefits apply automatically',
];

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const { state } = useLocation();
  const plan = searchParams.get('plan') || 'pro';
  const config = PLAN_CONFIG[plan] || PLAN_CONFIG.pro;
  const fullName = state?.fullName || 'Member';
  const membershipId = useMemo(
    () => state?.membershipId || `BF-${Math.floor(100000 + Math.random() * 900000)}`,
    [state?.membershipId]
  );
  const desktopWhatsNext = useMemo(
    () => [
      WHATS_NEXT[0],
      WHATS_NEXT[2],
      WHATS_NEXT[1],
      WHATS_NEXT[3],
    ],
    []
  );

  const handleCopyId = () => {
    navigator.clipboard?.writeText(membershipId);
  };

  return (
    <div className="payment-success">
      <div className="payment-success__mobile">
      <div className="payment-success__icon" aria-hidden>
        <svg viewBox="0 0 24 24" width="72" height="72">
          <circle cx="12" cy="12" r="11" fill="#22c55e" stroke="#22c55e" strokeWidth="2" />
          <path
            d="M8 12l3 3 5-6"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      <h1 className="payment-success__title">
        Payment
        <br />
        Successful
      </h1>

      <p className="payment-success__welcome">
        Welcome to the BelForce
        <br />
        Membership Community
      </p>

      <div className="payment-success__message">
        <p>
          Dear <span className="payment-success__name">{fullName}</span>, congratulations 🎉
        </p>
        <p>You&apos;re now officially part of the BelForce Membership Community.</p>
      </div>

      <div className="payment-success__details">
        <p className="payment-success__details-label">Selected Plan:</p>
        <p className="payment-success__details-value">{config.title}</p>
        <p className="payment-success__details-label">Membership ID:</p>
        <p className="payment-success__details-value">{membershipId}</p>
        <p className="payment-success__details-note">
          Please take a screenshot of this page for your records.
        </p>
      </div>

      <div className="payment-success__benefits-card">
        <h2 className="payment-success__benefits-heading">Your Membership Benefits — Active Now</h2>
        <p className="payment-success__benefits-subtitle">Applied automatically to your account</p>
        <div className="payment-success__id-badge">
          <span>{membershipId}</span>
          <button
            type="button"
            className="payment-success__copy-btn"
            onClick={handleCopyId}
            aria-label="Copy membership ID"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
            </svg>
          </button>
        </div>
        <ul className="payment-success__benefits-list">
          {BENEFITS.map((benefit, i) => (
            <li key={i} className="payment-success__benefit">
              <span className="payment-success__benefit-check" aria-hidden>
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
              </span>
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <p className="payment-success__benefits-note">No hidden fees. Benefits apply automatically — no action needed.</p>
        <p className="payment-success__benefits-security">
          Payments & data encrypted • Support 9:00 AM – 9:00 PM
          <span className="payment-success__lock" aria-hidden>
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </span>
        </p>
        <div className="payment-success__benefits-actions">
          <button type="button" className="payment-success__btn-download">Download receipt</button>
          <button type="button" className="payment-success__btn-support">Contact support</button>
        </div>
      </div>

      <div className="payment-success__next-card">
        <h2 className="payment-success__next-heading">What Happens Next?</h2>
        <ul className="payment-success__next-list">
          {WHATS_NEXT.map((item, i) => (
            <li key={i} className="payment-success__next-item">
              <span className="payment-success__next-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <circle cx="12" cy="12" r="10" fill="#9ca3af" />
                  <path d="M12 16v-4M12 8h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="payment-success__early-info">
        <span className="payment-success__early-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="20" height="20">
            <circle cx="12" cy="12" r="10" fill="currentColor" />
            <path d="M12 16v-4M12 8h.01" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none" />
          </svg>
        </span>
        <p>
          This is an early-access membership. You&apos;ll receive updates before launch so you&apos;re always informed.
        </p>
      </div>

      <p className="payment-success__thankyou">
        We look forward to serving you. Thank you for trusting BelForce and supporting safer resale.
      </p>

      <div className="payment-success__social">
        <p className="payment-success__social-text">Follow BelForce for launch updates & offers</p>
        <div className="payment-success__social-icons">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="payment-success__social-link" aria-label="Instagram">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="payment-success__social-link" aria-label="YouTube">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="payment-success__social-link" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="payment-success__footer-actions">
        <Link to="/" className="payment-success__btn-home">Back to Home</Link>
        <a href="https://wa.me/918374348314" target="_blank" rel="noopener noreferrer" className="payment-success__btn-contact">
          Contact Support
        </a>
      </div>

      <p className="payment-success__copyright">copyright 2026 - BelForce</p>
      </div>

      <div className="payment-success__desktop">
        <div className="payment-success__desktop-inner">
          <div className="payment-success__desktop-banner">
            <div className="payment-success__desktop-check" aria-hidden>
              <svg viewBox="0 0 24 24" width="44" height="44">
                <circle cx="12" cy="12" r="11" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
                <path
                  d="M8 12l3 3 5-6"
                  stroke="rgba(255,255,255,0.95)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
            <h1 className="payment-success__desktop-title">Payment Successful</h1>
            <p className="payment-success__desktop-subtitle">Welcome to the BelForce Early subscribers Community</p>
          </div>

          <div className="payment-success__desktop-grid">
            <div className="payment-success__desktop-card payment-success__desktop-card--left">
              <div className="payment-success__desktop-msg-title">
                Dear <span className="payment-success__desktop-name">{fullName}</span>, congratulations <span aria-hidden>🎉</span>
              </div>
              <div className="payment-success__desktop-msg-sub">
                You&apos;re now officially part of the BelForce Membership Community.
              </div>
              <div className="payment-success__desktop-women-wrap">
                <img src={womenImg} alt="" className="payment-success__desktop-women" loading="lazy" decoding="async" />
              </div>
            </div>

            <div className="payment-success__desktop-card payment-success__desktop-card--right">
              <div className="payment-success__desktop-label">Selected Plan:</div>
              <div className="payment-success__desktop-plan">{config.title}</div>

              <div className="payment-success__desktop-label payment-success__desktop-label--spaced">Membership ID:</div>
              <div className="payment-success__desktop-idrow">
                <div className="payment-success__desktop-id">{membershipId}</div>
                <button
                  type="button"
                  className="payment-success__desktop-copy"
                  onClick={handleCopyId}
                  aria-label="Copy membership ID"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                  </svg>
                </button>
              </div>

              <p className="payment-success__desktop-note">Please take a screenshot of this page for your records.</p>

              <div className="payment-success__desktop-actions">
                <button type="button" className="payment-success__desktop-btn" onClick={() => {}}>
                  <span className="payment-success__desktop-btn-icon" aria-hidden>⬇</span>
                  Download PDF
                </button>
                <button type="button" className="payment-success__desktop-btn" onClick={() => window.print()}>
                  <span className="payment-success__desktop-btn-icon" aria-hidden>🖨</span>
                  Print
                </button>
              </div>
            </div>
          </div>

          <h2 className="payment-success__desktop-next-heading">What Happens Next?</h2>

          <div className="payment-success__desktop-next-grid">
            <section className="payment-success__desktop-benefits-card" aria-label="Your Membership Benefits">
              <div className="payment-success__desktop-benefits-header">
                <div>
                  <div className="payment-success__desktop-benefits-title">Your Membership Benefits — Active Now</div>
                  <div className="payment-success__desktop-benefits-sub">
                    Applied automatically to your account (Membership ID: <span className="payment-success__desktop-inline-id">{membershipId}</span>)
                  </div>
                </div>
                <button type="button" className="payment-success__desktop-id-pill" onClick={handleCopyId} aria-label="Copy membership ID">
                  <span className="payment-success__desktop-id-pill-text">{membershipId}</span>
                  <span className="payment-success__desktop-id-pill-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
                    </svg>
                  </span>
                </button>
              </div>

              <div className="payment-success__desktop-divider" />

              <ul className="payment-success__desktop-benefits-list">
                {BENEFITS.map((benefit) => (
                  <li key={benefit} className="payment-success__desktop-benefit">
                    <span className="payment-success__desktop-benefit-check" aria-hidden>✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              <div className="payment-success__desktop-benefits-note">
                No hidden fees. Benefits apply automatically — no action needed.
              </div>

              <div className="payment-success__desktop-divider" />

              <div className="payment-success__desktop-security">
                <span className="payment-success__desktop-lock" aria-hidden>🔒</span>
                <span>Payments & data encrypted • Support available 9:00 AM – 9:00 PM</span>
              </div>

              <div className="payment-success__desktop-benefits-footer">
                <button type="button" className="payment-success__desktop-link" onClick={() => {}}>Download membership receipt</button>
                <button type="button" className="payment-success__desktop-link" onClick={() => {}}>Contact support</button>
              </div>
            </section>

            <section className="payment-success__desktop-next-list" aria-label="What happens next list">
              <ul className="payment-success__desktop-next-items">
                {desktopWhatsNext.map((item) => (
                  <li key={item} className="payment-success__desktop-next-item">
                    <span className="payment-success__desktop-next-icon" aria-hidden>
                      <svg viewBox="0 0 24 24" width="18" height="18">
                        <circle cx="12" cy="12" r="10" fill="#dbeafe" />
                        <path d="M10 8l4 4-4 4" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div className="payment-success__desktop-info">
            <span className="payment-success__desktop-info-icon" aria-hidden>ⓘ</span>
            <p>This is an early-access membership. You&apos;ll receive updates before launch so you&apos;re always informed.</p>
          </div>

          <p className="payment-success__desktop-thanks">
            We look forward to serving you.
            <br />
            Thank you for trusting BelForce and supporting safer resale.
          </p>

          <div className="payment-success__desktop-footer-actions">
            <Link to="/" className="payment-success__desktop-home">Back to Home</Link>
            <a
              href="https://wa.me/918374348314"
              target="_blank"
              rel="noopener noreferrer"
              className="payment-success__desktop-contact"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;
