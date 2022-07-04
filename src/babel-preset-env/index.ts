import { transformSync } from '@babel/core'
const sourceCode = `
class Song {
}
`

export const { code: presetCode, map } = transformSync(sourceCode, {
  targets: {
    browsers: 'Chrome 45',
  },
  presets: [
    [
      '@babel/preset-env',
      {
        debug: true,
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        corejs: 3,
      },
    ],
  ],
})
console.log(presetCode)
