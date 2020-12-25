export const flairMap = {
  angular: "angular.png",
  bash: "bash.png",
  c: "c.png",
  cSharp: "cSharp.png",
  cpp: "cpp.png",
  css: "css.png",
  dart: "dart.png",
  flutter: "flutter.png",
  go: "go.png",
  haskell: "haskell.png",
  html: "html.png",
  ionic: "ionic.png",
  java: "java.png",
  javascript: "javascript.png",
  kafka: "kafka.png",
  kotlin: "kotlin.png",
  kubernetes: "kubernetes.png",
  php: "php.png",
  python: "python.png",
  react: "react.png",
  ruby: "ruby.png",
  rust: "rust.png",
  svelte: "svelte.png",
  swift: "swift.png",
  tailwindcss: "tailwindcss.png",
  typescript: "typescript.png",
  vue: "vue.png"
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
