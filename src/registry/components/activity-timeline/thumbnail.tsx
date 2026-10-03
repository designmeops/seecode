import { ActivityTimeline } from "./activity-timeline";

export default function ActivityTimelineThumbnail() {
  return (
    <ActivityTimeline
      className="w-[500px] shrink-0"
      dateRange="Jan 20, 2023 - May 08, 2025"
      groups={[
        {
          label: "Today, May 06, 2025",
          events: [
            {
              icon: "click",
              segments: [
                { type: "person", name: "Evelyn Carter", color: "red" },
                "clicked",
                { type: "chip", label: "Find out more" },
              ],
              time: "9:13 AM",
            },
            {
              icon: "confetti",
              segments: [
                { type: "person", name: "Noah Bennett", color: "green" },
                "subscribed for a newsletter",
              ],
              time: "11:54 AM",
            },
          ],
        },
      ]}
    />
  );
}
