import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
    content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
    theme: {
        extend: {
            colors: {
                persian: {
                    "50": "#fff0f3",
                    "100": "#ffdee4",
                    "200": "#ffc2cd",
                    "300": "#ff98aa",
                    "400": "#ff5c78",
                    "500": "#ff2a4f",
                    "600": "#f80a33",
                    "700": "#d90429",
                    "800": "#ac0824",
                    "900": "#8e0e24",
                    "950": "#4e010e",
                },
            },
            fontSize: {
                "6xl": "3.5rem",
                "7xl": "4rem",
            },
            textShadow: {
                sm: "1px 1px 0px var(--tw-shadow-color)",
                DEFAULT: "2px 2px 0px var(--tw-shadow-color)",
                lg: "4px 4px 0px var(--tw-shadow-color)",
            },
            fontFamily: {
                title: ["var(--font-title)"],
                body: ["var(--font-body)"],
            },
            animation: {
                "spin-slow": "spin 5s linear infinite",
            },
        },
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
        plugin(function ({ matchUtilities, theme }) {
            matchUtilities(
                {
                    "text-shadow": (value) => ({
                        textShadow: value,
                    }),
                },
                // @ts-expect-error - This seems to be a bug in the tailwindcss types.
                { values: theme("textShadow") },
            );
        }),
    ],
};
export default config;
