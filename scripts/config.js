const path = require('path');
const typescript = require('rollup-plugin-typescript2');
const replace = require('rollup-plugin-replace');

const formatName = 'VueFormily';

const pkgName = 'vue-formily';

const formatMap = {
  es: 'esm',
  umd: ''
};

function createConfig(format) {
  const tsPlugin = typescript({
    tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    cacheRoot: path.resolve(__dirname, '../node_modules/.rts2_cache'),
    useTsconfigDeclarationDir: true,
    tsconfigOverride: {
      exclude: ['**/tests']
    }
  });

  const version = require(path.resolve(__dirname, `../package.json`)).version;

  const config = {
    input: {
      input: path.resolve(__dirname, `../src/index.ts`),
      external: ['vue'],
      plugins: [tsPlugin, replace({ __VERSION__: version })]
    },
    output: {
      banner: `/**
  * vue-formily v${version}
  * (c) ${new Date().getFullYear()} An Ha
  * @license MIT
  */`,
      format,
      name: format === 'umd' ? formatName : undefined,
      globals: {
        vue: 'Vue'
      }
    }
  };

  config.bundleName = `${pkgName}${formatMap[format] ? '.' + formatMap[format] : ''}.js`;

  return config;
}

module.exports = {
  formatName,
  pkgName,
  formatMap,
  createConfig
};
