import { type FlatXoConfig } from "xo";
import convexPlugin from "@convex-dev/eslint-plugin";
import routerPlugin from "@tanstack/eslint-plugin-router";

const xoConfig: FlatXoConfig = [
  {
    prettier: "compat",
    react: true,
    rules: {
      "@typescript-eslint/naming-convention": "off",
      "import-x/extensions": "off",
      "new-cap": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "sort-keys": "error",
    },
    space: 2,
  },
  {
    files: ["src/routeTree.gen.ts", "convex/_generated/*"],
    rules: {
      "unicorn/no-abusive-eslint-disable": "off",
    },
  },
  ...convexPlugin.configs.recommended, // eslint-disable-line @typescript-eslint/no-unsafe-assignment
  ...routerPlugin.configs["flat/recommended"],
];

export default xoConfig;
