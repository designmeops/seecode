/**
 * Minimal types for the `framer` package so the Framer versions of registry
 * components type-check here. In Framer the real module is provided for you.
 */
declare module "framer" {
  import type { ComponentType } from "react";

  export enum ControlType {
    Boolean = "boolean",
    Number = "number",
    String = "string",
    Color = "color",
    Enum = "enum",
    Image = "image",
    ResponsiveImage = "responsiveimage",
    File = "file",
    Array = "array",
    Object = "object",
    Link = "link",
    Date = "date",
    Font = "font",
    EventHandler = "eventhandler",
    ComponentInstance = "componentinstance",
    Transition = "transition",
  }

  // Control definitions are loosely typed on purpose: Framer validates them in the editor.
  export type PropertyControls = Record<string, Record<string, unknown>>;

  export function addPropertyControls(
    component: ComponentType<never>,
    controls: PropertyControls,
  ): void;
}
