/**
 * Stand-in for the `framer` package (aliased in vite.config.ts) so the Framer
 * version of each component can be rendered in tests and dev previews.
 */
export const ControlType = {
  Boolean: "boolean",
  Number: "number",
  String: "string",
  Color: "color",
  Enum: "enum",
  Image: "image",
  ResponsiveImage: "responsiveimage",
  File: "file",
  Array: "array",
  Object: "object",
  Link: "link",
  Date: "date",
  Font: "font",
  EventHandler: "eventhandler",
  ComponentInstance: "componentinstance",
  Transition: "transition",
} as const;

const controlsByComponent = new WeakMap<object, Record<string, Record<string, unknown>>>();

export function addPropertyControls(
  component: object,
  controls: Record<string, Record<string, unknown>>,
) {
  controlsByComponent.set(component, controls);
}

/** Default prop values declared through `addPropertyControls`. */
export function defaultPropsFromControls(component: object): Record<string, unknown> {
  const controls = controlsByComponent.get(component) ?? {};
  return Object.fromEntries(
    Object.entries(controls)
      .filter(([, control]) => "defaultValue" in control)
      .map(([key, control]) => [key, control.defaultValue]),
  );
}

export function getPropertyControls(component: object) {
  return controlsByComponent.get(component);
}
