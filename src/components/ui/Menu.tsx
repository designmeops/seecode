/** Shared styles for dropdown and context menus. */
export const menuContentClass =
  "z-[70] min-w-[220px] overflow-hidden rounded-lg border border-line bg-panel p-1 shadow-pop data-[state=open]:animate-pop-in";

export const menuItemClass =
  "flex h-8 cursor-pointer items-center gap-2 rounded-md px-2 text-mini text-ink-2 outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-hover data-[highlighted]:text-ink [&_svg]:text-ink-3 data-[highlighted]:[&_svg]:text-ink-2";

export const menuSeparatorClass = "my-1 h-px bg-line-subtle";

export const menuLabelClass = "px-2 pt-1.5 pb-1 text-[11.5px] font-medium text-ink-4";
