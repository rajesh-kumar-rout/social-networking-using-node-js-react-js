module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "poppins": ["Poppins", "sans-serif"],
        "Pacifico": ['Pacifico', 'cursive']
      },
      screens: {
        'post': '600px'
      }
    },

  },
  plugins: [
    // require('@tailwindcss/forms')
  ],
}
