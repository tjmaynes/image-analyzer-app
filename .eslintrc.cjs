module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2020: true
  },
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts', 'playwright*', 'node_modules'],
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['react-refresh'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
        'plugin:prettier/recommended'
      ],
      parser: '@typescript-eslint/parser',
      rules: {
        'react-refresh/only-export-components': [
          'warn',
          { allowConstantExport: true },
        ],
      },
    },
    {
      files: ['*.js'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
  ],
}
