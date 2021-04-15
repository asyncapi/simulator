module.exports =  {
    parser:  '@typescript-eslint/parser',
    plugins: [ 'prettier', 'eslint-plugin-react'],
    extends:  [
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
    ],
    parserOptions:  {
        ecmaVersion:  2018,
        sourceType:  'module',
        ecmaFeatures:  {
            jsx:  true,
        },
    },
    rules:  {
        indent: 0,
        '@typescript-eslint/indent': 0,
        '@typescript-eslint/member-delimiter-style': 0,
    },
    settings:  {
        react:  {
            version:  'detect',
        },
    },
};
