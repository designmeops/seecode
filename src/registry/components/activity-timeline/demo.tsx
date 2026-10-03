import { ActivityTimeline } from "./activity-timeline";

const subject = { type: "chip", label: "You’re missing something important! 🏆" } as const;

export default function ActivityTimelineDemo() {
  return (
    <ActivityTimeline
      className="w-[min(940px,100%)]"
      dateRange="Jan 20, 2023 - May 08, 2025"
      groups={[
        {
          label: "Today, May 06, 2025",
          events: [
            {
              icon: "eye",
              segments: [
                subject,
                "email has been delivered to",
                { type: "person", name: "Liam Anderson", color: "blue" },
              ],
              time: "7:32 AM",
              dateTime: "2025-05-06T07:32",
            },
            {
              icon: "mail",
              segments: [{ type: "person", name: "Mason Carter" }, "viewed email", subject],
              time: "9:12 AM",
              dateTime: "2025-05-06T09:12",
            },
            {
              icon: "click",
              segments: [
                { type: "person", name: "Evelyn Carter", color: "red" },
                "clicked",
                { type: "chip", label: "Find out more" },
                "in",
                subject,
              ],
              time: "9:13 AM",
              dateTime: "2025-05-06T09:13",
            },
            {
              icon: "map",
              segments: [
                { type: "person", name: "Ethan Sullivan", color: "blue" },
                "spent 3 minutes 32 seconds on",
                {
                  type: "link",
                  label: "www.acme.com/products",
                  href: "https://www.acme.com/products",
                },
              ],
              time: "9:16 AM",
              dateTime: "2025-05-06T09:16",
            },
          ],
        },
        {
          label: "May 01, 2025",
          events: [
            {
              icon: "confetti",
              segments: [
                { type: "person", name: "Noah Bennett", color: "green" },
                "subscribed for a newsletter",
              ],
              time: "11:54 PM",
              dateTime: "2025-05-01T23:54",
            },
            {
              icon: "eye",
              segments: [
                { type: "person", name: "Aiden Brooks" },
                "visited page",
                {
                  type: "link",
                  label: "www.acme.com/products-sales",
                  href: "https://www.acme.com/products-sales",
                },
              ],
              time: "11:44 PM",
              dateTime: "2025-05-01T23:44",
            },
          ],
        },
      ]}
    />
  );
}
