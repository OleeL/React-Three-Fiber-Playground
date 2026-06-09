import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([
    globalIgnores(["src/components/terrain/perlin.ts", "**/next.config.js"]),
    {
        extends: [
            ...compat.extends("airbnb-base"),
            ...compat.extends("plugin:@typescript-eslint/recommended"),
            ...compat.extends("prettier"),
            ...nextCoreWebVitals
        ],

        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 5,
            sourceType: "script",

            parserOptions: {
                project: "./tsconfig.json",
            },
        },

        settings: {
            "import/resolver": {
                node: {
                    extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
                },
            },
        },

        rules: {
            "react/jsx-key": "off",
            "react/display-name": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-console": "off",
            "no-console": "off",
            "no-underscore-dangle": "off",
            "no-unused-vars": "off",
            "no-shadow": "off",
            "no-continue": 0,
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/ban-ts-comment": "off",
            "@typescript-eslint/ban-types": "off",
            "@typescript-eslint/no-empty-function": "off",
            "import/prefer-default-export": "off",
            "no-plusplus": "off",
            "no-param-reassign": "off",
            "class-methods-use-this": "off",
            "arrow-body-style": "off",

            "no-restricted-syntax": ["warn", {
                selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(warn|error|info|trace)$/]",
                message: "Unexpected property on console object was called",
            }],

            "import/extensions": ["error", "ignorePackages", {
                js: "never",
                jsx: "never",
                ts: "never",
                tsx: "never",
            }],
        },
    },
]);