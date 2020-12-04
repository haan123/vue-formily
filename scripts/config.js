const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const formatNameMap = {
  'vue-formily': 'VeeValidate',
  rules: 'VeeValidateRules',
  i18n: 'VeeValidateI18n'
};

const pkgNameMap = {
  'vue-formily': 'vue-formily',
  rules: 'vue-formily-rules',
  i18n: 'vue-formily-i18n'
};

const formatMap = {
  es: 'esm',
  umd: ''
};

function createConfig(pkg, format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      exclude: ['**/tests']
    }
  });

  const version = require(path.resolve(__dirname, `../packages/${pkg}/package.json`)).version;

  const config = {
    input: {
      input: path.resolve(__dirname, `../packages/${pkg}/src/index.ts`),
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })]
    },
    output: {
      banner: `/**
  * vue-formily v${version}
  * (c) ${new Date().getFullYear()} Abdelrahman Awad
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      globals: {
        vue: 'Vue'
      }
    }
  };

  config.bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  // if (options.env) {
  //   config.input.plugins.unshift(
  //     replace({
  //       'process.env.NODE_ENV': JSON.stringify(options.env)
  //     })
  //   );
  // }

  return config;
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatMap,
  createConfig
};
