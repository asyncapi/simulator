const rules = require('./rules')

module.exports = {
  parser: "@typescript-eslint/parser",
  
  plugins: ["@typescript-eslint"],
  
  root: true,
  
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  
  globals: {
    require: true,
    Promise: true,
    process: true,
  },
  
  parserOptions: {
    ecmaVersion: '2018',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  
  rules,
}
