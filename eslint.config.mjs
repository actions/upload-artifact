import github from 'eslint-plugin-github'
import jest from 'eslint-plugin-jest'
import prettier from 'eslint-plugin-prettier/recommended'

const githubConfigs = github.getFlatConfigs()

export default [
  {
    ignores: ['**/node_modules/**', '**/lib/**', '**/dist/**']
  },
  githubConfigs.recommended,
  ...githubConfigs.typescript,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json'
      }
    },
    rules: {
      'prettier/prettier': ['error', {endOfLine: 'auto'}],
      'eslint-comments/no-use': 'off',
      'github/no-then': 'off',
      'github/filenames-match-regex': 'off',
      'github/array-foreach': 'off',
      'import/no-namespace': 'off',
      'import/named': 'off',
      'import/no-unresolved': 'off',
      'i18n-text/no-en': 'off',
      'filenames/match-regex': 'off',
      'no-shadow': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      camelcase: 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-shadow': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  {
    files: ['**/__tests__/**/*.ts'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'jest/expect-expect': 'off',
      'jest/no-conditional-expect': 'off'
    }
  }
]
