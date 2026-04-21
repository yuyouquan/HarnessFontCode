const path = require('path')
const { name } = require('./package');
const WebpackBar = require('webpackbar')
// const CracoAntDesignPlugin = require('craco-antd');
const CracoLessPlugin = require('craco-less');
const CircularDependencyPlugin = require('circular-dependency-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');

module.exports = {
  // webpack 配置
  webpack: {
    // 配置别名
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      '@': path.resolve(__dirname, 'src')
    },
    //解决 create-react-app 的开发者添加的特殊限制。它被实施ModuleScopePlugin以确保文件驻留在src/. 该插件确保来自应用程序源目录的相对导入不会到达它之外。
    configure: webpackConfig => {
      webpackConfig.output.library = 'harness-front-code';
      webpackConfig.output.libraryTarget = 'umd';
      webpackConfig.output.chunkLoadingGlobal = `webpackJsonp_${name}`;
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
      return webpackConfig;
    },
    plugins: [
      new SpeedMeasurePlugin(),
      // 添加打包进度查看
      new WebpackBar(),
      new CircularDependencyPlugin({
        // exclude detection of files based on a RegExp
        exclude: /node_modules/,
        // include specific files based on a RegExp
        include: /src/,
        // add errors to webpack instead of warnings
        failOnError: true,
        // allow import cycles that include an asyncronous import,
        // e.g. via import(/* webpackMode: "weak" */ './file.js')
        allowAsyncCycles: false,
        // set the current working directory for displaying module paths
        cwd: process.cwd()
      })
    ]
  },
  devServer: (devServerConfig) => {
    devServerConfig.headers = {
      'Access-Control-Allow-Origin': '*'
    };

    return devServerConfig;
  }
  //自定义antd主题颜色
  // plugins: [
  //   {
  //     plugin: CracoLessPlugin,
  //     options: {
  //       lessLoaderOptions: {
  //         lessOptions: {
  //           modifyVars: {
  //             '@primary-color': '#3D66ED', // 全局主色
  //             '@link-color': '#3D66ED',// 链接色
  //             '@success-color': '#0AC677',// 成功色
  //             '@warning-color': '#FE7B30',// 警告色
  //             '@error-color': '#FA5050'// 错误色
  //           },
  //           javascriptEnabled: true
  //         }
  //       }
  //     }
  //   }
  // ],
  //此方法会导致antd中的caro-less大于本地，导致项目启动失败
  // plugins: [
  //   {
  //     //配置antd的颜色
  //     plugin: CracoAntDesignPlugin,
  //     options: {
  //       customizeTheme: {
  //         '@primary-color': '#3D66ED', // 全局主色
  //         '@link-color': '#3D66ED',// 链接色
  //         '@success-color': '#0AC677',// 成功色
  //         '@warning-color': '#FE7B30',// 警告色
  //         '@error-color': '#FA5050'// 错误色
  //       }
  //     }
  //   }
  // ]
}