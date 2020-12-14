import type { ProfileFormData } from "./types";

// https://github.com/carbon-app/carbon/blob/640590a6898e6fa8a24fea6e360d74c36735c507/lib/constants.js#L663
export const LANGUAGES = [
  {
    name: "Auto",
    mode: "auto",
  },
  {
    name: "Apache",
    mode: "apache",
    mime: "text/apache",
    custom: true,
    highlight: true,
  },
  {
    name: "Bash",
    mode: "shell",
    mime: "application/x-sh",
    highlight: true,
  },
  {
    name: "Plain Text",
    mode: "text",
  },
  {
    name: "C",
    mode: "clike",
    mime: "text/x-csrc",
    short: "c",
  },
  {
    name: "C++",
    mode: "clike",
    mime: "text/x-c++src",
    short: "c-like",
    highlight: true,
  },
  {
    name: "C#",
    mode: "clike",
    mime: "text/x-csharp",
    short: "csharp",
    highlight: true,
  },
  {
    name: "Clojure",
    mode: "clojure",
    highlight: true,
  },
  {
    name: "COBOL",
    mode: "cobol",
  },
  {
    name: "CoffeeScript",
    mode: "coffeescript",
    highlight: true,
  },
  {
    name: "Crystal",
    mode: "crystal",
    highlight: true,
  },
  {
    name: "CSS",
    mode: "css",
    highlight: true,
  },
  {
    name: "D",
    mode: "d",
    highlight: true,
  },
  {
    name: "Dart",
    mode: "dart",
    highlight: true,
  },
  {
    name: "Diff",
    mode: "diff",
    mime: "text/x-diff",
    highlight: true,
  },
  {
    name: "Django",
    mode: "django",
    highlight: true,
  },
  {
    name: "Docker",
    mode: "dockerfile",
    highlight: true,
  },
  {
    name: "Elixir",
    mode: "elixir",
    custom: true,
    highlight: true,
  },
  {
    name: "Elm",
    mode: "elm",
    highlight: true,
  },
  {
    name: "Erlang",
    mode: "erlang",
    highlight: true,
  },
  {
    name: "Fortran",
    mode: "fortran",
    highlight: true,
  },
  {
    name: "Gherkin",
    mode: "gherkin",
    highlight: true,
  },
  {
    name: "GraphQL",
    mode: "graphql",
    custom: true,
  },
  {
    name: "Go",
    mode: "go",
    mime: "text/x-go",
    highlight: true,
  },
  {
    name: "Groovy",
    mode: "groovy",
    highlight: true,
  },
  {
    name: "Handlebars",
    mode: "handlebars",
    highlight: true,
  },
  {
    name: "Haskell",
    mode: "haskell",
    highlight: true,
  },
  {
    name: "HTML/XML",
    mode: "htmlmixed",
  },
  {
    name: "Java",
    mode: "clike",
    mime: "text/x-java",
    short: "java",
    highlight: true,
  },
  {
    name: "JavaScript",
    mode: "javascript",
    short: "javascript",
    highlight: true,
  },
  {
    name: "JSON",
    mode: "javascript",
    mime: "application/json",
    short: "json",
    highlight: true,
  },
  {
    name: "JSX",
    mode: "jsx",
    short: "jsx",
  },
  {
    name: "Julia",
    mode: "julia",
    highlight: true,
  },
  {
    name: "Kotlin",
    mode: "clike",
    mime: "text/x-kotlin",
    short: "kotlin",
    highlight: true,
  },
  {
    name: "LaTeX",
    mode: "stex",
    short: "latex",
    highlight: true,
  },
  {
    name: "Lisp",
    mode: "commonlisp",
    short: "lisp",
    highlight: true,
  },
  {
    name: "Lua",
    mode: "lua",
    highlight: true,
  },
  {
    name: "Markdown",
    mode: "markdown",
    highlight: true,
  },
  {
    name: "Mathematica",
    mode: "mathematica",
    highlight: true,
  },
  {
    name: "MATLAB/Octave",
    mode: "octave",
    mime: "text/x-octave",
    short: "matlab",
    highlight: true,
  },
  {
    name: "MySQL",
    mode: "sql",
    mime: "text/x-mysql",
    short: "mysql",
  },
  {
    name: "N-Triples",
    mode: "ntriples",
    mime: "application/n-triples",
  },
  {
    name: "NGINX",
    mode: "nginx",
    highlight: true,
  },
  {
    name: "Nim",
    mode: "nim",
    custom: true,
    highlight: true,
  },
  {
    name: "Objective C",
    mode: "clike",
    mime: "text/x-objectivec",
    short: "objectivec",
    highlight: true,
  },
  {
    name: "OCaml/F#",
    mode: "mllike",
    short: "ocaml",
    highlight: true,
  },
  {
    name: "Pascal",
    mode: "pascal",
  },
  {
    name: "Perl",
    mode: "perl",
    highlight: true,
  },
  {
    name: "PHP",
    mode: "php",
    mime: "text/x-php",
    short: "php",
    highlight: true,
  },
  {
    name: "PowerShell",
    mode: "powershell",
    highlight: true,
  },
  {
    name: "Python",
    mode: "python",
    highlight: true,
  },
  {
    name: "R",
    mode: "r",
    highlight: true,
  },
  {
    name: "RISC-V",
    mode: "riscv",
    custom: true,
  },
  {
    name: "Ruby",
    mode: "ruby",
    highlight: true,
  },
  {
    name: "Rust",
    mode: "rust",
    highlight: true,
  },
  {
    name: "Sass",
    mode: "sass",
  },
  {
    name: "Scala",
    mode: "clike",
    mime: "text/x-scala",
    short: "scala",
    highlight: true,
  },
  {
    name: "Smalltalk",
    mode: "smalltalk",
    highlight: true,
  },
  {
    name: "Solidity",
    mode: "solidity",
    custom: true,
  },
  {
    name: "SPARQL",
    mode: "sparql",
    mime: "application/sparql-query",
  },
  {
    name: "SQL",
    mode: "sql",
    highlight: true,
  },
  {
    name: "Stylus",
    mode: "stylus",
    mime: "stylus",
    highlight: true,
  },
  {
    name: "Swift",
    mode: "swift",
    highlight: true,
  },
  {
    name: "TCL",
    mode: "tcl",
    highlight: true,
  },
  {
    name: "TOML",
    mode: "toml",
  },
  {
    name: "Turtle",
    mode: "turtle",
    mime: "text/turtle",
  },
  {
    name: "TypeScript",
    mode: "javascript",
    mime: "application/typescript",
    short: "typescript",
    highlight: true,
  },
  {
    name: "TSX",
    mode: "jsx",
    mime: "text/typescript-jsx",
    short: "tsx",
  },
  {
    name: "Twig",
    mode: "twig",
    mime: "text/x-twig",
    highlight: true,
  },
  {
    name: "VB.NET",
    mode: "vb",
  },
  {
    name: "Verilog",
    mode: "verilog",
    highlight: true,
  },
  {
    name: "VHDL",
    mode: "vhdl",
    highlight: true,
  },
  {
    name: "Vue",
    mode: "vue",
  },
  {
    name: "XQuery",
    mode: "xquery",
    highlight: true,
  },
  {
    name: "YAML",
    mode: "yaml",
    highlight: true,
  },
];

export const languageOptions = LANGUAGES.map((l) => ({
  label: l.name,
  value: l.short || l.mode,
}));

const THEMES = [
  { id: "3024-night", name: "3024 Night" },
  { id: "a11y-dark", name: "A11y Dark" },
  { id: "blackboard", name: "Blackboard" },
  { id: "base16-dark", name: "Base 16 (Dark)" },
  { id: "base16-light", name: "Base 16 (Light)" },
  { id: "cobalt", name: "Cobalt" },
  { id: "dracula", name: "Dracula" },
  { id: "duotone-dark", name: "Duotone" },
  { id: "hopscotch", name: "Hopscotch" },
  { id: "lucario", name: "Lucario" },
  { id: "material", name: "Material" },
  { id: "monokai", name: "Monokai" },
  { id: "night-owl", name: "Night Owl" },
  { id: "nord", name: "Nord" },
  { id: "oceanic-next", name: "Oceanic Next" },
  { id: "one-light", name: "One Light" },
  { id: "one-dark", name: "One Dark" },
  { id: "panda-syntax", name: "Panda" },
  { id: "paraiso-dark", name: "Paraiso" },
  { id: "seti", name: "Seti" },
  { id: "shades-of-purple", name: "Shades of Purple " },
  { id: "solarized dark", name: "Solarized (Dark)" },
  { id: "solarized light", name: "Solarized (Light)" },
  { id: "synthwave-84", name: "SynthWave '84" },
  { id: "twilight", name: "Twilight" },
  { id: "verminal", name: "Verminal" },
  { id: "vscode", name: "VSCode" },
  { id: "yeti", name: "Yeti" },
  { id: "zenburn", name: "Zenburn" },
];

export const themeOptions = THEMES.map((l) => ({
  label: l.name,
  value: l.id,
}));

export const initialProfileData: ProfileFormData = {
  displayName: "",
  bio: "",
  gender: "male",
  genderToShow: "male",
  gendersToShow: ["male", "female", "non-binary"],
  goal: "friendship",
  ageRangeMax: 33,
  ageRangeMin: 18,
  month: "",
  day: "",
  year: "",
  location: "",
  flair: "",
  global: true,
};

export const defaultThemeAndLanguage = {
  fontFamily: "Fira Code",
  language: "auto",
  theme: "vscode",
};

export const FONTS = [
  { id: "Anonymous Pro", name: "Anonymous Pro" },
  { id: "Droid Sans Mono", name: "Droid Sans Mono" },
  { id: "Fantasque Sans Mono", name: "Fantasque Sans Mono" },
  { id: "Fira Code", name: "Fira Code" },
  { id: "Hack", name: "Hack" },
  { id: "IBM Plex Mono", name: "IBM Plex Mono" },
  { id: "Inconsolata", name: "Inconsolata" },
  { id: "Iosevka", name: "Iosevka" },
  { id: "JetBrains Mono", name: "JetBrains Mono" },
  { id: "Monoid", name: "Monoid" },
  { id: "Source Code Pro", name: "Source Code Pro" },
  { id: "Space Mono", name: "Space Mono" },
  { id: "Ubuntu Mono", name: "Ubuntu Mono" },
];

export const fontOptions = FONTS.map((l) => ({
  label: l.name,
  value: l.id,
}));

export const flairOptions = Object.keys(flairMap).map((l) => ({
  label: l,
  value: l,
}));

flairOptions.unshift({ label: "none", value: "" });
