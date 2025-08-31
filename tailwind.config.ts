import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: { 
          DEFAULT: 'rgb(var(--card) / <alpha-value>)', 
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)' 
        },
        popover: { 
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)', 
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)' 
        },
        primary: { 
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)', 
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)' 
        },
        secondary: { 
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)', 
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)' 
        },
        muted: { 
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)', 
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)' 
        },
        accent: { 
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)', 
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)' 
        },
        destructive: { 
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)', 
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)' 
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
        chart: {
          '1': 'rgb(var(--chart-1) / <alpha-value>)',
          '2': 'rgb(var(--chart-2) / <alpha-value>)',
          '3': 'rgb(var(--chart-3) / <alpha-value>)',
          '4': 'rgb(var(--chart-4) / <alpha-value>)',
          '5': 'rgb(var(--chart-5) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;