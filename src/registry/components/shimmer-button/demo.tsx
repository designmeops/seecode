import { ShimmerButton } from "./shimmer-button";

export default function ShimmerButtonDemo() {
  return (
    <ShimmerButton>
      Get started
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </ShimmerButton>
  );
}
