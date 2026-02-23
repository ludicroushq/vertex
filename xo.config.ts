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
];

export default xoConfig;
