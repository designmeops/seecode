"use client";

import { Alert } from "./alert-callout";

export default function AlertCalloutDemo() {
  return (
    <div className="flex w-96 flex-col gap-2.5">
      <Alert variant="info" title="Scheduled maintenance" dismissible>
        The API is read-only Oct 12, 2–3 AM UTC.
      </Alert>
      <Alert
        variant="warning"
        title="Your trial ends in 3 days"
        action={{ label: "Upgrade", href: "#billing" }}
      >
        Keep unlimited projects and guests.
      </Alert>
      <Alert
        variant="danger"
        title="Deployment failed"
        action={{ label: "View logs", onClick: () => console.info("Opening build logs") }}
      >
        acme-web exited with code 1.
      </Alert>
    </div>
  );
}
