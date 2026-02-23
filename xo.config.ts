import { type FlatXoConfig } from "xo";

const xoConfig: FlatXoConfig = [
  {
    react: true,
    prettier: true,
    space: 2,
    rules: {
      "react/react-in-jsx-scope": "off",
      "import-x/extensions": "off",
    },
  },
  {
    files: ["src/routeTree.gen.ts"],
    rules: {
      "unicorn/no-abusive-eslint-disable": "off",
    },
  },
];

export default xoConfig;
