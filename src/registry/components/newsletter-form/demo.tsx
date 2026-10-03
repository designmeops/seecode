import { NewsletterForm } from "./newsletter-form";

// Stand-in for your API call, e.g. `fetch("/api/subscribe", { method: "POST", body })`.
function subscribe(_email: string) {
  return new Promise<void>((resolve) => setTimeout(resolve, 1200));
}

export default function NewsletterFormDemo() {
  return <NewsletterForm className="w-96" onSubscribe={subscribe} />;
}
