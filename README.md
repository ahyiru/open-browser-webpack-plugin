## open-browser-webpack-plugin

webpack 构建完自动打开浏览器插件。

```js
const OpenBrowserWebpackPlugin = require('@huxy/open-browser-webpack-plugin');

new OpenBrowserWebpackPlugin({target:`${HOST}:${PORT}`}),

```

配置参数见 [open](https://www.npmjs.com/package/open)。