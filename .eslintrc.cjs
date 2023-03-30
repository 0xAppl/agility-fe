module.exports = {
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:prettier/recommended',
    'plugin:import/typescript',
  ],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'max-lines': [
      'error',
      {
        max: 350,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'max-lines': [
      'error',
      {
        max: 350,
        skipBlankLines: true,
        skipComments: true,
      },
    ],
    'import/no-named-as-default': 'off',
    'import/default': 'off',
    'react-hooks/exhaustive-deps': 'error',
    'import/order': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/prefer-optional-chain': 'error',
    'no-unused-vars': 'error',
    'no-console': 'off',
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true, ignoreIIFE: true }],
  },
};
