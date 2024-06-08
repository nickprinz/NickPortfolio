/** @type {import('tailwindcss').Config} */
import radient from "./src/plugins/radient"
console.log(radient)
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [...radient.plugins],
}

