import type { ThemeRegistration } from "shiki/core";

interface Palette {
  foreground: string;
  comment: string;
  keyword: string;
  string: string;
  constant: string;
  func: string;
  type: string;
  tag: string;
  attribute: string;
  punctuation: string;
}

function theme(name: string, type: "light" | "dark", palette: Palette): ThemeRegistration {
  const p = palette;
  return {
    name,
    type,
    colors: { "editor.foreground": p.foreground },
    tokenColors: [
      {
        scope: ["comment", "punctuation.definition.comment"],
        settings: { foreground: p.comment, fontStyle: "italic" },
      },
      {
        scope: [
          "keyword",
          "storage",
          "storage.type",
          "storage.modifier",
          "keyword.control",
          "keyword.operator.new",
          "keyword.operator.expression",
          "keyword.operator.typeof",
          "variable.language.this",
        ],
        settings: { foreground: p.keyword },
      },
      {
        scope: ["string", "string.template", "punctuation.definition.string"],
        settings: { foreground: p.string },
      },
      {
        scope: [
          "constant.numeric",
          "constant.language",
          "constant.character",
          "keyword.other.unit",
          "support.constant",
        ],
        settings: { foreground: p.constant },
      },
      {
        scope: ["entity.name.function", "support.function", "meta.function-call.generic"],
        settings: { foreground: p.func },
      },
      {
        scope: [
          "entity.name.type",
          "support.type",
          "support.type.primitive",
          "entity.other.inherited-class",
          "entity.name.type.alias",
          "entity.name.type.interface",
        ],
        settings: { foreground: p.type },
      },
      {
        scope: ["entity.name.tag", "punctuation.definition.tag"],
        settings: { foreground: p.tag },
      },
      {
        scope: ["support.class.component", "entity.name.tag.custom"],
        settings: { foreground: p.func },
      },
      {
        scope: ["entity.other.attribute-name"],
        settings: { foreground: p.attribute },
      },
      {
        scope: [
          "punctuation",
          "meta.brace",
          "keyword.operator",
          "punctuation.separator",
          "punctuation.terminator",
          "punctuation.accessor",
        ],
        settings: { foreground: p.punctuation },
      },
      {
        scope: ["variable", "variable.other", "variable.parameter", "meta.object-literal.key"],
        settings: { foreground: p.foreground },
      },
      {
        scope: ["support.type.property-name.css", "support.type.vendored.property-name.css"],
        settings: { foreground: p.type },
      },
      {
        scope: [
          "entity.other.attribute-name.class.css",
          "entity.other.attribute-name.id.css",
          "entity.name.tag.css",
          "entity.other.keyframe-offset.css",
        ],
        settings: { foreground: p.keyword },
      },
      {
        scope: [
          "support.constant.property-value.css",
          "constant.other.color.rgb-value.hex.css",
          "string.unquoted.attribute-value.html",
        ],
        settings: { foreground: p.string },
      },
    ],
  };
}

/** Calm syntax colors that sit next to Linear's palettes; both share one token map. */
export const codeThemeLight = theme("seecode-light", "light", {
  foreground: "#2b2e36",
  comment: "#a1a4ad",
  keyword: "#5e6ad2",
  string: "#28805e",
  constant: "#c0561b",
  func: "#2a63c9",
  type: "#0d7d8c",
  tag: "#c03d64",
  attribute: "#9a6213",
  punctuation: "#868a95",
});

export const codeThemeDark = theme("seecode-dark", "dark", {
  foreground: "#d4d6dc",
  comment: "#62666d",
  keyword: "#a4a9ff",
  string: "#7cc99a",
  constant: "#f0a875",
  func: "#7cb0ff",
  type: "#5fc4d4",
  tag: "#f0819f",
  attribute: "#e2bf7d",
  punctuation: "#7d828c",
});
