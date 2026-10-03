import { Check, type LucideIcon, Monitor, Moon, Sun } from "lucide-react";
import { DropdownMenu } from "radix-ui";
import { setThemePreference, type ThemePreference, useTheme } from "../lib/theme";
import { IconButton } from "./ui/Button";
import { menuContentClass, menuItemClass, menuLabelClass } from "./ui/Menu";
import { Tooltip } from "./ui/Tooltip";

export const THEME_OPTIONS: { value: ThemePreference; label: string; icon: LucideIcon }[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const isPreference = (value: string): value is ThemePreference =>
  THEME_OPTIONS.some((option) => option.value === value);

/** Light, dark or follow the system — like Linear's interface theme setting. */
export function ThemeMenu() {
  const { preference, theme } = useTheme();
  const Icon = theme === "dark" ? Moon : Sun;
  const current = THEME_OPTIONS.find((option) => option.value === preference)!;

  return (
    <DropdownMenu.Root>
      <Tooltip label={`Theme: ${current.label}`} side="top">
        <DropdownMenu.Trigger asChild>
          <IconButton
            label={`Theme: ${current.label}`}
            className="data-[state=open]:bg-active data-[state=open]:text-ink"
          >
            <Icon size={15} strokeWidth={1.9} />
          </IconButton>
        </DropdownMenu.Trigger>
      </Tooltip>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side="top"
          align="end"
          sideOffset={6}
          collisionPadding={8}
          className={`${menuContentClass} min-w-[184px]`}
        >
          <DropdownMenu.Label className={menuLabelClass}>Interface theme</DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={preference}
            onValueChange={(value) => isPreference(value) && setThemePreference(value)}
          >
            {THEME_OPTIONS.map(({ value, label, icon: OptionIcon }) => (
              <DropdownMenu.RadioItem key={value} value={value} className={menuItemClass}>
                <OptionIcon size={15} strokeWidth={1.9} />
                {label}
                <DropdownMenu.ItemIndicator className="ml-auto flex">
                  <Check size={14} strokeWidth={2.2} className="text-ink-2!" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
