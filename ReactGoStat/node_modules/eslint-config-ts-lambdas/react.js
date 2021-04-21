module.exports = {
  plugins: ['react'],
  rules: {
    'react/destructuring-assignment': 'off',
    'react/display-name': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-curly-brace-presence': ['error', 'never'],
    'react/jsx-filename-extension': 'off',
    'react/jsx-fragments': ['error', 'syntax'],
    'react/jsx-handler-names': 'off',
    'react/jsx-key': [
      'error',
      {
        checkFragmentShorthand: true
      }
    ],
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-literals': 'off',
    'react/jsx-no-script-url': 'error',
    'react/jsx-no-target-blank': 'off',
    'react/jsx-no-undef': 'error',
    'react/jsx-no-useless-fragment': 'error',
    'react/jsx-pascal-case': 'error',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-danger': 'off',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-direct-mutation-state': 'error',
    'react/no-is-mounted': 'error',
    'react/no-multi-comp': 'off',
    'react/no-this-in-sfc': 'error',
    'react/no-unescaped-entities': 'error',
    'react/no-unsafe': [
      'error',
      {
        checkAliases: true
      }
    ],
    'react/prefer-stateless-function': 'off',
    'react/require-optimization': 'off',
    'react/require-render-return': 'error',
    'react/self-closing-comp': 'off',
    'react/void-dom-elements-no-children': 'error',
    /**
     * In React, this is technically safe in this instance:
     * https://github.com/typescript-eslint/typescript-eslint/issues/2063#issuecomment-675156492
     */
    "@typescript-eslint/ban-types": [
      "error",
      {
        "extendDefaults": true,
        "types": {
          "{}": false
        }
      }
    ]
  },
}
