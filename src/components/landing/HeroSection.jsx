import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import H1 from '../../assets/images/h1.webp';
import H2 from '../../assets/images/h2.webp';
import IMG3 from '../../assets/images/IMG3.webp';
import ultraFastIcon from '../../assets/icons/ultra_fast.webp';
import securePaymentsIcon from '../../assets/icons/secure_payments.webp';
import simpleProcessIcon from '../../assets/icons/simple_process.webp';

const CAROUSEL_IMAGES = [H1, H2, IMG3];
const CAROUSEL_INTERVAL_MS = 4000;

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);
    }, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index) => setActiveIndex(index);

  const goPrev = () => setActiveIndex((prev) => (prev - 1 + CAROUSEL_IMAGES.length) % CAROUSEL_IMAGES.length);
  const goNext = () => setActiveIndex((prev) => (prev + 1) % CAROUSEL_IMAGES.length);

  return (
    <section className="hero">
      <div className="hero__content">
        <div className="hero__left">
          <h1 className="hero__heading">
            Struggling to sell used phones or laptops at the best price — safely?
          </h1>
          <div className="hero__mobile-content">
          <p className="hero__subheading">
            A better way to sell used electronics is coming.
          </p>
          <div className="hero__buttons">
            <Link to="/membership-plans/choose-plan?plan=promax" className="hero__btn hero__btn--early-access">
              <svg className="hero__btn-icon hero__btn-icon--membership" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7v3h14v-3a7 7 0 00-7-7z" />
              </svg>
              Pre-order Subscription NOW
            </Link>
            <Link to="/how-it-works" className="hero__btn hero__btn--how-it-works">
              How BelForce Works
            </Link>
          </div>
          </div>
          <div className="hero__features">
            <div className="hero__feature">
              <div className="hero__feature-icon">
                <img src={ultraFastIcon} alt="" className="hero__feature-icon-img" decoding="async" />
              </div>
              <span>Ultra Fast Sales</span>
            </div>
            <div className="hero__feature">
              <div className="hero__feature-icon">
                <img src={securePaymentsIcon} alt="" className="hero__feature-icon-img" decoding="async" />
              </div>
              <span>Secure Payments</span>
            </div>
            <div className="hero__feature">
              <div className="hero__feature-icon">
                <img src={simpleProcessIcon} alt="" className="hero__feature-icon-img" decoding="async" />
              </div>
              <span>Simple Process</span>
            </div>
          </div>
        </div>
        <div className="hero__right">
          <div className="hero__carousel">
            <button type="button" className="hero__carousel-arrow hero__carousel-arrow--left" onClick={goPrev} aria-label="Previous">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="hero__carousel-main">
              {CAROUSEL_IMAGES.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Slide ${i + 1}`}
                  className={`hero__carousel-img ${i === activeIndex ? 'hero__carousel-img--active' : ''}`}
                  loading={i === activeIndex ? 'eager' : 'lazy'}
                  decoding="async"
                />
              ))}
            </div>
            <button type="button" className="hero__carousel-arrow hero__carousel-arrow--right" onClick={goNext} aria-label="Next">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
          <div className="hero__thumbnails">
            {CAROUSEL_IMAGES.map((img, i) => (
              <button
                key={i}
                type="button"
                className={`hero__thumbnail ${i === activeIndex ? 'hero__thumbnail--active' : ''}`}
                onClick={() => goToSlide(i)}
                aria-label={`View slide ${i + 1}`}
              >
                <img src={img} alt={`Thumbnail ${i + 1}`} loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          <div className="hero__dots" aria-hidden>
            {CAROUSEL_IMAGES.map((_, i) => (
              <span
                key={i}
                className={`hero__dot ${i === activeIndex ? 'hero__dot--active' : ''}`}
                role="presentation"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
