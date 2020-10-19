module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    mocha: true,
    'truffle/globals': true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:chai-expect/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'truffle',
    'chai-expect',
  ],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};
