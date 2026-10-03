import type { ThemeRegistration } from "shiki/core";

/** A calm light syntax theme that sits well next to Linear's palette. */
export const codeTheme: ThemeRegistration = {
  name: "seecode-light",
  type: "light",
  colors: {
    "editor.background": "#fbfbfc",
    "editor.foreground": "#2b2e36",
  },
  tokenColors: [
    {
      scope: ["comment", "punctuation.definition.comment"],
      settings: { foreground: "#a1a4ad", fontStyle: "italic" },
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
      settings: { foreground: "#5e6ad2" },
    },
    {
      scope: ["string", "string.template", "punctuation.definition.string"],
      settings: { foreground: "#28805e" },
    },
    {
      scope: [
        "constant.numeric",
        "constant.language",
        "constant.character",
        "keyword.other.unit",
        "support.constant",
      ],
      settings: { foreground: "#c0561b" },
    },
    {
      scope: ["entity.name.function", "support.function", "meta.function-call.generic"],
      settings: { foreground: "#2a63c9" },
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
      settings: { foreground: "#0d7d8c" },
    },
    {
      scope: ["entity.name.tag", "punctuation.definition.tag"],
      settings: { foreground: "#c03d64" },
    },
    {
      scope: ["support.class.component", "entity.name.tag.custom"],
      settings: { foreground: "#2a63c9" },
    },
    {
      scope: ["entity.other.attribute-name"],
      settings: { foreground: "#9a6213" },
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
      settings: { foreground: "#868a95" },
    },
    {
      scope: ["variable", "variable.other", "variable.parameter", "meta.object-literal.key"],
      settings: { foreground: "#2b2e36" },
    },
    {
      scope: ["support.type.property-name.css", "support.type.vendored.property-name.css"],
      settings: { foreground: "#0d7d8c" },
    },
    {
      scope: [
        "entity.other.attribute-name.class.css",
        "entity.name.tag.css",
        "entity.other.keyframe-offset.css",
      ],
      settings: { foreground: "#5e6ad2" },
    },
    {
      scope: ["support.constant.property-value.css", "constant.other.color.rgb-value.hex.css"],
      settings: { foreground: "#28805e" },
    },
  ],
};
