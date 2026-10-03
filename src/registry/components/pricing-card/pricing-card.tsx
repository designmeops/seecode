"use client";

import { useId, useState, type HTMLAttributes, type ReactNode } from "react";

export type BillingCycle = "monthly" | "yearly";

export type PricingCardProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Plan name, e.g. "Pro". */
  name: ReactNode;
  description?: ReactNode;
  /** Small pill next to the name, e.g. "Most popular". */
  badge?: ReactNode;
  /** Price per month for each billing cycle. The yearly saving is derived from these. */
  price: { monthly: number; yearly: number };
  /** Currency symbol placed before the price. */
  currency?: string;
  features: ReactNode[];
  ctaLabel?: ReactNode;
  /** Called by the call-to-action with the selected billing cycle. */
  onSelectPlan?: (billing: BillingCycle) => void;
  /** Small print under the call-to-action. */
  footnote?: ReactNode;
  /** Controlled billing cycle, e.g. to sync several cards. */
  billing?: BillingCycle;
  defaultBilling?: BillingCycle;
  onBillingChange?: (billing: BillingCycle) => void;
};

const cycles: BillingCycle[] = ["monthly", "yearly"];

function formatAmount(amount: number) {
  return Number.isInteger(amount) ? String(amount) : amount.toFixed(2);
}

export function PricingCard({
  name,
  description,
  badge,
  price,
  currency = "$",
  features,
  ctaLabel = "Get started",
  onSelectPlan,
  footnote,
  billing: billingProp,
  defaultBilling = "monthly",
  onBillingChange,
  className = "",
  ...props
}: PricingCardProps) {
  const [uncontrolled, setUncontrolled] = useState<BillingCycle>(defaultBilling);
  const billing = billingProp ?? uncontrolled;
  const groupName = useId();
  // Rounded down so the label never overstates the saving (the epsilon absorbs float error).
  const saving = Math.floor(((price.monthly - price.yearly) / price.monthly) * 100 + 1e-6);
  const caption =
    billing === "yearly"
      ? `${currency}${formatAmount(price.yearly * 12)} billed yearly`
      : "Billed monthly";

  function selectBilling(next: BillingCycle) {
    if (billingProp === undefined) setUncontrolled(next);
    onBillingChange?.(next);
  }

  return (
    <div
      className={`relative w-80 rounded-2xl border border-zinc-200 bg-white p-6 shadow-[0_1px_2px_rgb(9_9_11/0.04),0_16px_40px_-16px_rgb(9_9_11/0.16)] ${className}`}
      {...props}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-10 -top-px h-px bg-linear-to-r from-transparent via-indigo-500/70 to-transparent"
      />
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base/6 font-semibold tracking-tight text-zinc-950">{name}</h3>
        {badge ? (
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-600/15 ring-inset">
            {badge}
          </span>
        ) : null}
      </div>
      {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}

      {/* Native radios give arrow-key navigation for free; the white pill slides between them. */}
      <div
        role="radiogroup"
        aria-label="Billing period"
        className="relative mt-5 grid grid-cols-2 rounded-lg bg-zinc-100 p-0.5 ring-1 ring-zinc-950/5 ring-inset"
      >
        <span
          aria-hidden="true"
          className={`absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-md bg-white shadow-[0_1px_2px_rgb(9_9_11/0.08),0_0_0_1px_rgb(9_9_11/0.04)] transition-transform duration-200 ease-out motion-reduce:transition-none ${billing === "yearly" ? "translate-x-full" : ""}`}
        />
        {cycles.map((cycle) => (
          <label
            key={cycle}
            className="relative flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md text-sm font-medium text-zinc-500 transition-colors duration-150 select-none hover:text-zinc-700 has-checked:text-zinc-950 has-focus-visible:outline-2 has-focus-visible:outline-indigo-500"
          >
            <input
              type="radio"
              name={groupName}
              value={cycle}
              checked={billing === cycle}
              onChange={() => selectBilling(cycle)}
              className="sr-only"
            />
            {cycle === "monthly" ? "Monthly" : "Yearly"}
            {cycle === "yearly" && saving > 0 ? (
              <span className="rounded-full bg-emerald-50 px-1.5 text-[11px]/4 font-semibold text-emerald-700 ring-1 ring-emerald-600/15 ring-inset">
                −{saving}%
              </span>
            ) : null}
          </label>
        ))}
      </div>

      <div className="mt-5 flex items-baseline gap-1.5" aria-hidden="true">
        {/* Both prices share one grid cell, so swapping them never shifts the layout. */}
        <span className="grid">
          {cycles.map((cycle) => (
            <span
              key={cycle}
              className={`col-start-1 row-start-1 text-4xl/none font-semibold tracking-tight text-zinc-950 tabular-nums transition duration-200 ease-out ${
                cycle === billing ? "" : "translate-y-1.5 opacity-0 blur-[3px] motion-reduce:translate-y-0"
              }`}
            >
              {currency}
              {formatAmount(price[cycle])}
            </span>
          ))}
        </span>
        <span className="text-sm text-zinc-500">/month</span>
      </div>
      <p className="mt-1.5 text-xs text-zinc-500 tabular-nums" aria-hidden="true">
        {caption}
      </p>
      <p className="sr-only" aria-live="polite">
        {`${currency}${formatAmount(price[billing])} per month, ${caption.toLowerCase()}`}
      </p>

      <ul className="mt-5 space-y-2 border-t border-zinc-100 pt-5">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2.5 text-sm/5 text-zinc-700">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="mt-0.5 size-4 shrink-0 text-indigo-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12.5 9.5 17 19 7.5" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelectPlan?.(billing)}
        className="mt-6 inline-flex h-10 w-full cursor-pointer items-center justify-center rounded-lg bg-zinc-950 text-sm font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_1px_2px_rgb(9_9_11/0.2)] transition duration-150 hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 active:scale-[0.99]"
      >
        {ctaLabel}
      </button>
      {footnote ? <p className="mt-3 text-center text-xs text-zinc-500">{footnote}</p> : null}
    </div>
  );
}
