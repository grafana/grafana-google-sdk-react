import resolve from "@rollup/plugin-node-resolve";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "path";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";
import { nodeExternals } from "rollup-plugin-node-externals";

// Derived from this file's own location rather than a package-manager-injected
// env var (e.g. Yarn's PROJECT_CWD), so this works identically under npm/yarn/pnpm.
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const rq = createRequire(import.meta.url);
const pkg = rq("./package.json");

const legacyOutputDefaults = {
  esModule: true,
  interop: "compat",
};

export default [
  {
    input: "src/index.ts",
    plugins: [
      nodeExternals({
        deps: true,
        peerDeps: true,
        packagePath: "./package.json",
      }),
      commonjs(),
      resolve(),
      esbuild({
        target: "es2018",
        tsconfig: "tsconfig.build.json",
      }),
    ],
    output: [
      {
        format: "cjs",
        sourcemap: true,
        file: pkg.main,
        ...legacyOutputDefaults,
      },
      {
        format: "esm",
        sourcemap: true,
        dir: path.dirname(pkg.module),
        preserveModules: true,
        preserveModulesRoot: path.join(projectRoot, "src"),
        ...legacyOutputDefaults,
      },
    ],
  },
  {
    input: "./compiled/index.d.ts",
    plugins: [dts()],
    output: [
      {
        file: pkg.exports["."].require.types,
        format: "cjs",
      },
      {
        file: pkg.exports["."].import.types,
        format: "esm",
      },
    ],
  },
];
