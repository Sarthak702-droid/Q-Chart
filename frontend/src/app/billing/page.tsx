import { Check } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/AppShell";

const plans = [
  {
    name: "Starter",
    price: "Rs 999/month",
    features: ["2 team members", "1,000 conversations", "Core channels", "Live chat"]
  },
  {
    name: "Growth",
    price: "Rs 2,999/month",
    features: ["10 team members", "Unlimited conversations", "AI replies", "Priority support"]
  }
];

export default function BillingPage() {
  return (
    <AppShell
      title="Billing"
      description="Simple pricing that lets you validate willingness to pay before building enterprise features."
      action={<Link className="app-action" href="/integrations">Review Included Channels</Link>}
    >
      <section className="pricing-grid app-pricing-grid">
        {plans.map((plan) => (
          <article className="price-panel" key={plan.name}>
            <h3>{plan.name}</h3>
            <strong>{plan.price}</strong>
            <ul>
              {plan.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} />
                  {feature}
                </li>
              ))}
            </ul>
            <Link className="ghost-action" href="/settings">Demo plan only</Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
