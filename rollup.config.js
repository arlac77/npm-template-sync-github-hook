import cleanup from "rollup-plugin-cleanup";
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import json from "rollup-plugin-json";
import executable from "rollup-plugin-executable";
import pkg from "./package.json";

const external = ["npm-template-sync", "github-repository-provider"];

export default {
  output: {
    file: pkg.bin["npm-template-sync-github-hook"],
    format: "cjs",
    banner: "#!/usr/bin/env node",
    interop: false
  },
  plugins: [
    resolve(),
    commonjs(),
    json({
      include: "package.json",
      preferConst: true,
      compact: true
    }),
    cleanup(),
    executable()
  ],
  external,
  input: "src/npm-template-sync-github-hook.mjs"
};
