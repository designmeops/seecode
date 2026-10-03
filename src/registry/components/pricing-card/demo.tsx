import { PricingCard } from "./pricing-card";

export default function PricingCardDemo() {
  return (
    <PricingCard
      name="Pro"
      badge="Most popular"
      description="For growing teams that ship every week."
      price={{ monthly: 24, yearly: 19 }}
      features={[
        "Unlimited projects and members",
        "Advanced insights and reports",
        "Custom domains with SSL",
        "SAML single sign-on",
        "Priority support",
      ]}
      ctaLabel="Upgrade to Pro"
      footnote="14-day free trial · Cancel anytime"
    />
  );
}
