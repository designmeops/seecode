import { defineComponent } from "../../define";
import nextjs from "./activity-timeline.tsx?raw";
import framer from "./activity-timeline.framer.tsx?raw";
import webflow from "./activity-timeline.webflow.html?raw";
import Demo from "./demo";
import usage from "./demo.tsx?raw";
import Thumbnail from "./thumbnail";

export default defineComponent({
  slug: "activity-timeline",
  name: "Activity Timeline",
  description:
    "A day-by-day activity feed: event icons on a timeline, people, inline chips and links, and a date-range button.",
  category: "data-display",
  tags: ["activity", "timeline", "feed", "crm"],
  author: "designme",
  createdAt: "2026-10-03",
  version: "1.0.0",
  featured: true,
  formats: {
    nextjs: { name: "activity-timeline.tsx", language: "tsx", code: nextjs },
    framer: { name: "ActivityTimeline.tsx", language: "tsx", code: framer },
    webflow: { name: "activity.html", language: "html", code: webflow },
  },
  usage,
  props: [
    { name: "title", type: "string", default: '"Activity"', description: "Section heading." },
    {
      name: "dateRange",
      type: "string",
      description:
        'Label of the date-range button, e.g. "Jan 20, 2023 - May 08, 2025". Omit to hide the button.',
    },
    {
      name: "onDateRangeClick",
      type: "() => void",
      description: "Called when the date-range button is pressed; open your date picker here.",
    },
    {
      name: "groups",
      type: "{ label: string; events: ActivityEvent[] }[]",
      description: 'Days in order, each with a heading such as "Today, May 06, 2025".',
    },
    {
      name: "groups[].events[]",
      type: '{ icon: "eye" | "mail" | "click" | "map" | "confetti"; segments: ActivitySegment[]; time: string; dateTime?: string }',
      description:
        'One row: the event-type icon, the sentence and a time such as "9:12 AM". dateTime renders a <time> element.',
    },
    {
      name: "events[].segments[]",
      type: 'string | { type: "person"; name; avatarUrl?; color? } | { type: "chip"; label } | { type: "link"; label; href }',
      description:
        'The sentence in reading order: text, a person (avatar + name; color "blue" | "red" | "green" | "gray"), a chip or a link chip.',
    },
    {
      name: "...props",
      type: "HTMLAttributes<HTMLElement>",
      description: "Passed to the section element.",
    },
  ],
  preview: { component: Demo, thumbnail: Thumbnail, cardScale: 0.68, height: 660, width: 940 },
});
