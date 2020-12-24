const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const dirMap = {
  'vue-formily': path.resolve(__dirname, `../src/index.ts`),
  rules: path.resolve(__dirname, `../src/rules/index.ts`),
}

const formatNameMap = {
  'vue-formily': 'VueFormily',
  rules: 'VeeValidateRules'
};

const pkgNameMap = {
  'vue-formily': 'vue-formily',
  rules: 'vue-formily-rules'
};

const formatMap = {
  es: 'esm',
  umd: ''
};

const tsPlugin = typescript({
  tsconfig: path.resolve(__dirname, '../tsconfig.json'),
  cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
  useTsconfigDeclarationDir: true,
  tsconfigOverride: {
    exclude: ['**/tests']
  }
});

const package = require(path.resolve(__dirname, `../package.json`));

function createConfig(pkg, format) {
  const config = {
    input: {
      input: dirMap[pkg],
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: package.version })]
    },
    output: {
      banner: `/**
  * vue-formily v${package.version}
  *
  * @link ${package.homepage}
  * @source ${package.repository}
  * (c) ${new Date().getFullYear()} An Ha
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatNameMap[pkg] : undefined,
      sourcemap: true,
      globals: {
        vue: 'Vue'
      }
    }
  };

  config.bundleName = `${pkgNameMap[pkg]}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  return config;
}

module.exports = {
  formatNameMap,
  pkgNameMap,
  formatMap,
  createConfig
};
