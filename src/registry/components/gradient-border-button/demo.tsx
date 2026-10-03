import { GradientBorderButton } from "./gradient-border-button";

export default function GradientBorderButtonDemo() {
  return (
    <GradientBorderButton>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 text-fuchsia-500"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5c.5 4.2 2.3 6 6.5 6.5-4.2.5-6 2.3-6.5 6.5-.5-4.2-2.3-6-6.5-6.5 4.2-.5 6-2.3 6.5-6.5Z" />
        <path d="M19 16.5c.2 1.4.6 1.8 2 2-1.4.2-1.8.6-2 2-.2-1.4-.6-1.8-2-2 1.4-.2 1.8-.6 2-2Z" />
      </svg>
      Generate with AI
    </GradientBorderButton>
  );
}
