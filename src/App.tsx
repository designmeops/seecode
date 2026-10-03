import { Compass } from "lucide-react";
import { useEffect } from "react";
import { CommandMenu } from "./components/CommandMenu";
import { PublishDialog, ShortcutsDialog } from "./components/Dialogs";
import { EmptyState } from "./components/EmptyState";
import { AppShell } from "./components/layout/AppShell";
import { NavigationButton, PageHeader } from "./components/layout/PageHeader";
import { Toaster } from "./components/Toaster";
import { Button } from "./components/ui/Button";
import { TooltipProvider } from "./components/ui/Tooltip";
import { useHotkeys } from "./hooks/useHotkeys";
import { navigate, type Route, routeKey, useRoute } from "./lib/router";
import { closeDialog, dialogStore, openDialog } from "./lib/state";
import { BrowsePage } from "./pages/BrowsePage";
import { ComponentPage } from "./pages/ComponentPage";
import { getCategory } from "./registry/categories";

function pageTitle(route: Route): string | null {
  switch (route.name) {
    case "explore":
      return "seecode — Component marketplace";
    case "category":
      return `${getCategory(route.category).name} · seecode`;
    case "tag":
      return `#${route.tag} · seecode`;
    case "favorites":
      return "Favorites · seecode";
    case "recent":
      return "Recently copied · seecode";
    case "not-found":
      return "Not found · seecode";
    case "component":
      return null; // set by the component page
  }
}

export function App() {
  const route = useRoute();

  useEffect(() => {
    const title = pageTitle(route);
    if (title) document.title = title;
  }, [route]);

  useHotkeys({
    "mod+k": () => (dialogStore.get() === "command" ? closeDialog() : openDialog("command")),
    "?": () => openDialog("shortcuts"),
    "g e": () => navigate({ name: "explore" }),
    "g f": () => navigate({ name: "favorites" }),
    "g r": () => navigate({ name: "recent" }),
  });

  return (
    <TooltipProvider>
      <AppShell>
        {route.name === "component" ? (
          <ComponentPage slug={route.slug} />
        ) : route.name === "not-found" ? (
          <NotFound />
        ) : (
          <BrowsePage key={routeKey(route)} route={route} />
        )}
      </AppShell>
      <CommandMenu />
      <ShortcutsDialog />
      <PublishDialog />
      <Toaster />
    </TooltipProvider>
  );
}

function NotFound() {
  return (
    <>
      <PageHeader>
        <NavigationButton />
        <h1 className="text-[13.5px] font-medium text-ink">Not found</h1>
      </PageHeader>
      <EmptyState
        icon={Compass}
        title="This page doesn’t exist"
        description="The link may be broken, or the page may have moved."
        action={
          <Button size="sm" onClick={() => navigate({ name: "explore" })}>
            Back to Explore
          </Button>
        }
      />
    </>
  );
}
