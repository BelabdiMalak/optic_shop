/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./frontend/**/*.{html,js,jsx,ts,tsx}", // Scan all files under frontend directory
    "./frontend/pages/**/*.{html,js,jsx,ts,tsx}", // Specifically include files under pages (like userDashboard)
    "./frontend/components/ui/**/*.{html,js,jsx,ts,tsx}", // Include the ui folder under components
  ],
  darkMode: 'class', // Make sure dark mode is set to class
  theme: {
    extend: {},
  },
  plugins: [],
}
