/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(214, 89%, 95%)",
          100: "hsl(214, 89%, 90%)",
          200: "hsl(214, 89%, 80%)",
          300: "hsl(214, 89%, 70%)",
          400: "hsl(214, 89%, 60%)",
          500: "hsl(214, 89%, 52%)" /* Main primary color */,
          600: "hsl(214, 89%, 45%)",
          700: "hsl(214, 89%, 40%)",
          800: "hsl(214, 89%, 35%)",
          900: "hsl(214, 89%, 30%)",
          950: "hsl(214, 89%, 25%)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        social: {
          facebook: "#1877F2",
          twitter: "#1DA1F2",
          instagram: "#E4405F",
          linkedin: "#0A66C2",
          youtube: "#FF0000",
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
      boxShadow: {
        social: "0 2px 8px rgba(0, 0, 0, 0.1)",
        "social-hover": "0 4px 12px rgba(0, 0, 0, 0.15)",
        "social-dark": "0 2px 8px rgba(0, 0, 0, 0.3)",
        "social-dark-hover": "0 4px 12px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
