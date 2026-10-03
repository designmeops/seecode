import { PeopleList } from "./people-list";

export default function PeopleListThumbnail() {
  return (
    <PeopleList
      className="w-[470px] shrink-0"
      people={[
        { name: "Liam Anderson", email: "l.anderson@acme.studio", color: "blue" },
        { name: "Evelyn Carter", email: "e.carter@acme.studio", color: "red" },
        { name: "Oliver Thompson", email: "o.thompson@acme.studio", color: "blue" },
        { name: "Noah Bennett", email: "n.bennett@acme.studio", color: "green" },
      ]}
    />
  );
}
