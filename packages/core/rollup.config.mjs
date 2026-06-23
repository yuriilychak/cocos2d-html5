/**
 * Rollup config for the core package.
 *
 * Plugin execution order (all in renderChunk phase):
 *   1. stripExports  — removes export { ... } and export const → const
 *   2. stripWorkspaceImports — strips @aspect/* import lines
 */
import { existsSync } from "fs";
import { join } from "path";
import MagicString from "magic-string";
import resolve from "@rollup/plugin-node-resolve";
import ts from "typescript";

const PKG_DIR = process.cwd();
const inputFile = existsSync(join(PKG_DIR, "src", "index.ts"))
  ? join(PKG_DIR, "src", "index.ts")
  : join(PKG_DIR, "src", "index.js");

function typescriptPlugin() {
  return {
    name: "typescript-transpile",
    transform(code, id) {
      if (!id.endsWith(".ts")) {
        return null;
      }

      const result = ts.transpileModule(code, {
        fileName: id,
        compilerOptions: {
          target: ts.ScriptTarget.ES2019,
          module: ts.ModuleKind.ESNext,
          sourceMap: true,
          inlineSources: true
        },
        reportDiagnostics: true
      });

      const diagnostics = result.diagnostics?.filter(
        diagnostic => diagnostic.category === ts.DiagnosticCategory.Error
      );

      if (diagnostics?.length) {
        this.error(
          ts.formatDiagnosticsWithColorAndContext(diagnostics, {
            getCanonicalFileName: fileName => fileName,
            getCurrentDirectory: () => process.cwd(),
            getNewLine: () => "\n"
          })
        );
      }

      return {
        code: result.outputText,
        map: result.sourceMapText ? JSON.parse(result.sourceMapText) : null
      };
    }
  };
}

function stripExportsPlugin() {
  return {
    name: "strip-exports",
    renderChunk(code) {
      const s = new MagicString(code);
      const regex = /^export\s*\{[^}]*\}\s*(?:from\s*['"][^'"]*['"]\s*)?;?[ \t]*\n?/gm;
      let match;
      while ((match = regex.exec(code)) !== null) {
        s.remove(match.index, match.index + match[0].length);
      }
      if (s.hasChanged()) {
        return { code: s.toString(), map: s.generateMap({ hires: true }) };
      }
      return null;
    }
  };
}

function stripWorkspaceImportsPlugin() {
  return {
    name: "strip-workspace-imports",
    renderChunk(code) {
      const s = new MagicString(code);
      const regex =
        /^import\s*\{([^}]*)\}\s*from\s*['"]@aspect\/[^'"]*['"]\s*;?[ \t]*\n?/gm;
      let match;
      while ((match = regex.exec(code)) !== null) {
        const specifiers = match[1];
        const declarations = specifiers
          .split(",")
          .map(sp => sp.trim())
          .filter(Boolean)
          .map(spec => {
            const asMatch = spec.match(/^(\S+)\s+as\s+(\S+)$/);
            if (asMatch) {
              return `var ${asMatch[2]} = ${asMatch[1]};`;
            }
            return null;
          })
          .filter(Boolean)
          .join("\n");

        const replacement = declarations ? declarations + "\n" : "";
        s.overwrite(match.index, match.index + match[0].length, replacement);
      }
      if (s.hasChanged()) {
        return { code: s.toString(), map: s.generateMap({ hires: true }) };
      }
      return null;
    }
  };
}

export default {
  input: inputFile,
  treeshake: false,
  external: (id) => id.startsWith("@aspect/"),
  plugins: [
    resolve({ extensions: [".ts", ".js"] }),
    typescriptPlugin(),
    stripExportsPlugin(),
    stripWorkspaceImportsPlugin()
  ],
  output: {
    file: "dist/index.js",
    format: "es",
    strict: false,
    sourcemap: true
  }
};
