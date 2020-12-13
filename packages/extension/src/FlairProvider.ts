export const flairMap = {
  kubernetes: "kubernetes.png",
  python: "python.png",
  flutter: "flutter.png",
  angular: "angular.png",
  cpp: "cpp.png",
  haskell: "haskell.png",
  java: "java.png",
  rust: "rust.png",
  vue: "vue.png",
  javascript: "javascript.png",
  go: "go.png",
  cSharp: "cSharp.png",
  html: "html.png",
  swift: "swift.png",
  react: "react.png",
  kafka: "kafka.png",
  php: "php.png",
  c: "c.png",
  typescript: "typescript.png",
  css: "css.png",
  dart: "dart.png",
  svelte: "svelte.png",
  kotlin: "kotlin.png",
  ruby: "ruby.png",
  tailwindcss: "tailwindcss.png",
  ionic: "ionic.png",
  bash: "bash.png"
};

export class FlairProvider {
  static javascriptMapString = "";
  static getJavascriptMapString() {
    if (!this.javascriptMapString) {
      return `
      const flairMap = {
        ${Object.entries(flairMap).map(
          ([k, v]) => `"${k}": "https://flair.benawad.com/${v}"`
        )}
      }
      `;
    }

    return this.javascriptMapString;
  }
}
