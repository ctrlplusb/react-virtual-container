const flow = require('rollup-plugin-flow')
const babel = require('rollup-plugin-babel')
const changeCase = require('change-case')
const packageJson = require('./package.json')

process.env.BABEL_ENV = 'production'

module.exports = {
  input: 'src/index.js',
  output: {
    file: `dist/${packageJson.name}.js`,
    format: 'umd',
    sourcemap: true,
    name: changeCase
      .titleCase(packageJson.name.replace(/-/g, ' '))
      .replace(/ /g, ''),
  },
  plugins: [
    flow({ all: true }),
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [['env', { modules: false }], 'stage-3', 'react'],
      plugins: ['external-helpers'],
    }),
  ],
}
