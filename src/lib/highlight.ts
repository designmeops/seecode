import { useEffect, useState } from "react";
import type { HighlighterCore, ThemedToken } from "shiki/core";
import type { CodeLanguage } from "../registry/types";
import { codeTheme } from "./code-theme";

let highlighter: Promise<HighlighterCore> | null = null;
const cache = new Map<string, ThemedToken[][]>();

/** Loads Shiki lazily — it is only needed once someone opens a component. */
function getHighlighter(): Promise<HighlighterCore> {
  highlighter ??= Promise.all([
    import("shiki/core"),
    import("shiki/engine/javascript"),
    import("shiki/langs/tsx.mjs"),
    import("shiki/langs/css.mjs"),
  ]).then(([core, engine, tsx, css]) =>
    core.createHighlighterCore({
      themes: [codeTheme],
      langs: [tsx.default, css.default],
      engine: engine.createJavaScriptRegexEngine(),
    }),
  );
  return highlighter;
}

const grammarFor = (language: CodeLanguage) => (language === "css" ? "css" : "tsx");

/** Returns highlighted lines, or `null` while the highlighter loads. */
export function useHighlightedLines(code: string, language: CodeLanguage): ThemedToken[][] | null {
  const key = `${language}\u0000${code}`;
  const [lines, setLines] = useState<{ key: string; lines: ThemedToken[][] } | null>(() => {
    const cached = cache.get(key);
    return cached ? { key, lines: cached } : null;
  });

  useEffect(() => {
    if (cache.has(key)) {
      setLines({ key, lines: cache.get(key)! });
      return;
    }
    let cancelled = false;
    getHighlighter()
      .then((instance) => {
        const { tokens } = instance.codeToTokens(code.replace(/\n$/, ""), {
          lang: grammarFor(language),
          theme: codeTheme.name!,
        });
        cache.set(key, tokens);
        if (!cancelled) setLines({ key, lines: tokens });
      })
      .catch((error: unknown) => console.error("[seecode] Syntax highlighting failed", error));
    return () => {
      cancelled = true;
    };
  }, [key, code, language]);

  return lines?.key === key ? lines.lines : null;
}

/** Start loading the highlighter ahead of time (e.g. on card hover). */
export function preloadHighlighter() {
  void getHighlighter();
}
