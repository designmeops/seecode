import { PeopleList } from "./people-list";

export default function PeopleListDemo() {
  return (
    <PeopleList
      className="w-[min(470px,100%)]"
      people={[
        { name: "Liam Anderson", email: "l.anderson@acme.studio", color: "blue" },
        { name: "Mason Carter", email: "m.carter@acme.studio" },
        { name: "Evelyn Carter", email: "e.carter@acme.studio", color: "red" },
        { name: "Oliver Thompson", email: "o.thompson@acme.studio", color: "blue" },
        { name: "Noah Bennett", email: "n.bennett@acme.studio", color: "green" },
        { name: "Aiden Brooks", email: "a.brooks@acme.studio" },
        { name: "Ethan Sullivan", email: "e.sullivan@acme.studio", color: "blue" },
      ]}
    />
  );
}
