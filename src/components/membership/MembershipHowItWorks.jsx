const STEPS = [
  {
    number: 1,
    title: 'App Launch',
    description: 'Our app launches between April 10 – April 15, 2026.',
  },
  {
    number: 2,
    title: 'Purchase Membership',
    description: 'Purchase a membership now to lock early-access benefits — these offers may not be available after launch.',
  },
  {
    number: 3,
    title: 'Log In',
    description: 'Once the app is live, log in using your name, phone number, and membership ID.',
  },
  {
    number: 4,
    title: 'Benefits Applied',
    description: 'Your membership benefits will be automatically applied when you use BelForce services.',
  },
];

function MembershipHowItWorks() {
  return (
    <section className="membership-how">
      <h2 className="membership-how__heading">How Pre-Paid Subscription Works after launch</h2>
      <div className="membership-how__list">
        {STEPS.map((step) => (
          <div key={step.number} className="membership-how__card">
            <h3 className="membership-how__card-title">
              <span className="membership-how__number">{step.number}.</span>{' '}
              <span className="membership-how__title">{step.title}</span>
            </h3>
            <p className="membership-how__card-desc">{step.description}</p>
          </div>
        ))}
      </div>
      <p className="membership-how__conclusion">
        You&apos;re buying our membership service in advance — and securing long-term resale advantages.
      </p>
    </section>
  );
}

export default MembershipHowItWorks;
