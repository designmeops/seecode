import { FloatingLabelInput } from "./floating-label-input";

export default function FloatingLabelInputDemo() {
  return (
    <form className="grid w-80 gap-4" noValidate>
      <FloatingLabelInput
        label="Work email"
        type="email"
        name="email"
        autoComplete="email"
        defaultValue="ana@northwind.com"
        hint="We'll send your workspace invite here."
      />
      <FloatingLabelInput
        label="Company"
        name="company"
        autoComplete="organization"
        placeholder="Northwind Traders"
        error="Company name is required."
      />
    </form>
  );
}
