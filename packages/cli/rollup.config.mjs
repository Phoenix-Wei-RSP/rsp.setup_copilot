import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIST = join(__dirname, "..", "..", "dist");

export default {
  input: "src/index.ts",
  output: {
    file: join(ROOT_DIST, "cli.js"),
    format: "esm",
    banner: "#!/usr/bin/env node",
  },
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    typescript({ tsconfig: "./tsconfig.json" }),
  ],
  // Mark only Node.js built-ins as external, bundle everything else
  external: (id) =>
    id.startsWith("node:") ||
    [
      "fs",
      "path",
      "os",
      "child_process",
      "crypto",
      "util",
      "url",
      "tty",
    ].includes(id),
};
