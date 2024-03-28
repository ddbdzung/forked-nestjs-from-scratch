/* eslint-disable */
require('source-map-support/register');

module.exports = function (api) {
  api.cache(true);

  const presets = ['@babel/preset-typescript', '@babel/preset-env'];
  const plugins = ['@babel/plugin-transform-typescript'];

  return {
    presets,
    plugins,
    env: {
      development: {
        sourceMaps: 'inline',
        plugins: ['source-map-support'],
      },
    },
  };
};
