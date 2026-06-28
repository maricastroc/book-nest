/** PostCSS pipeline for the Tailwind v4 design-system layer.
 *  Stitches (legacy pages) injects CSS at runtime and is unaffected by this. */
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}
