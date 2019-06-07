module.exports = {
    root: true,
    env: {
      browser: true,
      node: true
    },
    parserOptions: {
      parser: 'babel-eslint'
    },
    extends: [
      // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
      // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
      'plugin:vue/essential',
      'plugin:nuxt/recommended'
    ],
    // required to lint *.vue files
    plugins: [
      'vue',
      'nuxt'
    ],
    // add your custom rules here
    rules: {
      'vue/max-attributes-per-line': 'off',
      'max-len': 'off',
      // 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "vue/no-use-v-if-with-v-for": "off"
    // "nuxt/rule-name": 2
    }
  }
  