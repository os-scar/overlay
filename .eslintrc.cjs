module.exports = {
  env: {
    browser: true,
    es2021: true,
    webextensions: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  overrides: [
    {
      files: ['**/tests/**/*.js', '**/*.test.js'],
      env: {
        node: true,
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-unused-vars': ['error', { destructuredArrayIgnorePattern: '^_', ignoreRestSiblings: true }],
    'no-restricted-imports': [
      'error',
      {
        patterns: [{ group: ['**/tests/*'], message: 'Do not import from the tests folder' }],
      },
    ],
  },
};
