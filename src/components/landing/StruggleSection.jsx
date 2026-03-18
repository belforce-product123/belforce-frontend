import lowballOffers from '../../assets/logo/lowball_offers.webp';
import truestIssues from '../../assets/logo/truest_issues.webp';
import timeConsuming from '../../assets/logo/time_consuming.webp';
import dataSecurityRisks from '../../assets/logo/data_security_risks.webp';
import limitedReach from '../../assets/logo/limited_reach.webp';
import complexProcess from '../../assets/logo/complex_proess.webp';

const CARDS = [
  { id: 'lowball', title: 'Lowball Offers', description: 'Tired of getting less than your electronics are worth?', icon: lowballOffers, highlighted: false },
  { id: 'trust', title: 'Trust Issues', description: 'Worried about scams or unreliable buyers?', icon: truestIssues, highlighted: false },
  { id: 'time', title: 'Time Consuming', description: 'Spending hours listing and negotiating?', icon: timeConsuming, highlighted: false },
  { id: 'data', title: 'Data Security Risks', description: 'Unsure if your personal data is truly erased?', icon: dataSecurityRisks, highlighted: true },
  { id: 'reach', title: 'Limited Reach', description: 'Struggling to find the right buyer locally?', icon: limitedReach, highlighted: false },
  { id: 'complex', title: 'Complex Process', description: 'Confused by complicated selling procedures?', icon: complexProcess, highlighted: false },
];

const MOBILE_PROBLEMS = [
  'Classified ads are expensive and stressful',
  'No guarantee of sale',
  'Too much bargaining & low-ball offers',
  'Fake buyers & scammers',
  'Unsafe manual meetups with strangers',
  'Zero support after listing',
];

function RedXIcon() {
  return (
    <span className="struggle__x-icon" aria-hidden>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill="#D94646" />
        <path d="M6 6l8 8M14 6l-8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function StruggleSection() {
  return (
    <section className="struggle">
      {/* Desktop layout */}
      <div className="struggle__desktop">
        <h2 className="struggle__heading">The Current Struggle : Why Selling Used Electronics is Hard</h2>
        <div className="struggle__grid">
          {CARDS.map((card) => (
            <div key={card.id} className={`struggle__card ${card.highlighted ? 'struggle__card--highlighted' : ''}`}>
              <div className="struggle__card-icon">
                <img src={card.icon} alt={card.title} loading="lazy" decoding="async" />
              </div>
              <h3 className="struggle__card-title">{card.title}</h3>
              <p className="struggle__card-desc">{card.description}</p>
            </div>
          ))}
        </div>
        <p className="struggle__conclusion">It shouldn&apos;t be this complicated to get a fair price and peace of mind.</p>
      </div>

      {/* Mobile layout */}
      <div className="struggle__mobile">
        <div className="struggle__banner">
          <span className="struggle__banner-line1">The current struggle :</span>
          <span className="struggle__banner-line2">why selling USED Electronics is Hard</span>
        </div>
        <h2 className="struggle__mobile-heading">The Problem with Classified Ads</h2>
        <div className="struggle__mobile-list">
          {MOBILE_PROBLEMS.map((text, i) => (
            <div key={i} className="struggle__mobile-card">
              <RedXIcon />
              <span className="struggle__mobile-card-text">{text}</span>
            </div>
          ))}
        </div>
        <p className="struggle__mobile-conclusion">Selling used items should feel simple — not risky and exhausting.</p>
      </div>
    </section>
  );
}

export default StruggleSection;
