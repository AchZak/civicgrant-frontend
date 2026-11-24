// @ts-check
const eslint = require('@eslint/js');
const { defineConfig, globalIgnores } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  globalIgnores(['src/app/api/schema.ts']),
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/prefer-signals': 'error',
      '@angular-eslint/prefer-output-readonly': 'error',
      '@angular-eslint/prefer-service-decorator': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/i18n': [
        'error',
        {
          checkId: true,
          requireDescription: false,
          ignoreAttributes: [
            'accept',
            'aria-controls',
            'aria-describedby',
            'aria-haspopup',
            'aria-labelledby',
            'aria-live',
            'currency',
            'dataKey',
            'inputId',
            'inputmode',
            'locale',
            'mode',
            'optionLabel',
            'optionValue',
            'severity',
            'size',
            'variant',
          ],
        },
      ],
      '@angular-eslint/template/no-any': 'error',
      '@angular-eslint/template/no-non-null-assertion': 'error',
      '@angular-eslint/template/no-inline-styles': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
    },
  },
  {
    files: ['src/index.html'],
    rules: {
      '@angular-eslint/template/i18n': 'off',
    },
  },
]);
