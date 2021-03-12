module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  plugins: [
    'react',
    'only-warn',
  ],
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'linebreak-style': 'off',
    'react/destructuring-assignment': 'off',
    'no-console': 'off',
    'array-callback-return': 'off',
    'react/jsx-fragments': 'off',
    'no-underscore-dangle': [2, { allow: ['_id'] }],
  },
};
