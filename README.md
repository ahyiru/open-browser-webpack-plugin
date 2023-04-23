## open-browser-webpack-plugin

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ahyiru/open-browser-webpack-plugin/blob/develop/LICENSE)
[![npm version](https://img.shields.io/npm/v/@huxy/open-browser-webpack-plugin.svg)](https://www.npmjs.com/package/@huxy/open-browser-webpack-plugin)
[![npm](https://img.shields.io/npm/dt/@huxy/open-browser-webpack-plugin)](https://www.npmjs.com/package/@huxy/open-browser-webpack-plugin)
[![](https://img.shields.io/badge/blog-ihuxy-blue.svg)](http://ihuxy.com/)

webpack 构建完自动打开浏览器插件。

```javascript
import OpenBrowserWebpackPlugin from '@huxy/open-browser-webpack-plugin';

new OpenBrowserWebpackPlugin({target: `${HOST}:${PORT}`}),

```

配置参数见 [open](https://www.npmjs.com/package/open) 。
