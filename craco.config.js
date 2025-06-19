const path = require('path');
const CracoLessPlugin = require('craco-less');

module.exports = {
  style: {
    modules: {
      // 启用所有 .module.less 文件的 CSS Modules
      localIdentName: '[local]__[hash:base64:5]',
    },
    less: {
      loaderOptions: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true,
            // modifyVars: { /* your theme overrides */ },
          },
        },
      },
    },
  ],
};

