import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import tsParser from '@typescript-eslint/parser'
import vueParser from 'vue-eslint-parser'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,vue,tsx}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: { parser: tsParser, ecmaVersion: 2022, sourceType: 'module' },
    },
    plugins: { vue, '@typescript-eslint': ts },
    rules: {
      ...vue.configs['flat/recommended'][0].rules,
      ...ts.configs.recommended.rules,
    },
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  pluginVue.configs['flat/essential'],

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*'],
  },
  skipFormatting,
)
