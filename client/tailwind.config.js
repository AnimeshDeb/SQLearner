export default {
  // This 'content' array is the critical part.
  // It tells Tailwind to scan all your component files inside 'src'.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can also add your custom palette here
      // so you can use classes like `bg-coral-pink`
      colors: {
        'coral-pink': '#FF6F61',
        'soft-sand': '#F8EDEB',
        'warm-gray': '#E9E7E7',
        'deep-charcoal': '#2B2B2B',
        'muted-peach': '#1e110dff',
        'cool-teal': '#3DCCC7',
        'golden-amber': '#F4A261',
      },
    },
  },
  plugins: [],
}