import { createTestsBundleConfig } from "../../scripts/rollup.app.mjs";
import livereload from "rollup-plugin-livereload";

const config = createTestsBundleConfig({
  input: "src/index.js",
  outputFile: "dist/tests.min.js",
  minify: false,
});

config.plugins.push(livereload("dist"));

export default config;
