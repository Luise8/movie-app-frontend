module.exports = {
  env: { browser: true, es2021: true, jest: true },
          'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.ts', '.d.ts', '.tsx']
            },
      },  
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'airbnb',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
  },
};
