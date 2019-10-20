# 搭建webpack+react+es6开发环境

# 初始化项目

```
npm init -yes// 默认跳过所有需要选择的条目
```

## 安装webpack
```
npm install --sava-dev webpack
```
如果想使用webpack4+版本，还需安装webpack-cli
```
npm install --save-dev webpack-cli
```


## webpack配置项解读
- mode: 告诉webpack开发模式，'production'则会压缩代码，'development'则会很清晰将代码组织关系保留下来，方便开发。
- entroy: 入口文件数组。例如path.jion(__dirname, 'index.html')。需要使用nodejs的path模块。
- output: 文件出口。需要提供输出文件名和路径，并且此路径必须使用绝对路径。使用path.resolve(from, to),可以把一个路径或路径片段的序列解析为一个绝对路径。
- module: 是文件内容的解析规则，会在这里使用各种加载器，处理css自动补全前缀、sass、图片、字体、@import CSS, CSS插入位置等。规则数组中，use数组里的加载器将会从右到左依次执行。例如` use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader']`会先使用postcss加载器处理css兼容性问题，再使用sass加载器将sass样式表转换为css，再使用css加载器将css文件使用@import"xx.css"的文件整合加载到一个css文件中，最后使用style加载器将前面处理好的样式文件载入html文件。
- plugins: 使用其他插件，对html、css文件抽离为单独的文件等等。例如HtmlWebpackPlugin可以将目标html文件抽离为单个html文件，MiniCssExtractPlugin可以压缩css并抽离。

## 配置webpack配置文件

首先安装必要的加载器
```
# npm i -D autoprefixer style-loader css-loader sass node-sass sass-loader postcss-loader html-loader html-webpack-plugin uglifyjs-webpack-plugin mini-css-extract-plugin webpack-merge babel-loader
```
 新建webpack.config.js
 安装必要插件`npm install --save-dev html-webpack-plugin mini-css-extract-plugin`

```
const path = require("path"); 
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    entry: [
        path.join(__dirname, './src/index.html'),
        path.join(__dirname, './src/index.jsx'),
    ],
    output: {
        filename: 'main.[hash:8].js',
        path: path.resolve(__dirname, 'dict')
    },
    module: {
        rules: [
            {
                // 处理jsx、js文件
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        sourceMap: true,
                    }
                }
            }, {
                ///处理html
                test: /\.html?/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "src"),
                use: {
                    loader: "html-loader",
                    options: {
                        minimize: true,  //压缩html代码
                        sourceMap: true  //生产环境可以不用资源映射
                    }
                }
            }, {
                // 处理样式
                test: /\.css|scss|less$/,
                use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(path.resolve(__dirname, "src"), "index.html"),
            filename: "index.html",
        }),
        new MiniCssExtractPlugin({
          filename: "[name].[hash].css",
          chunkFilename:"[id].[hash].css"
        }),
    ]
}
```
注： 在项目中使用postcss还需要创建`.browserslistrc`文件和`postcss.config.js`，指明需要兼容的浏览器版本
```
# .browserslistrc

defaults,
not ie < 11,
last 2 versions,
> 1%,
iOS 7,
last 3 iOS versions

# postcss.config.js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
## 配置webpack-dev-server
安装webpack-dev-server

```
npm install --save-dev webpack-dev-server
```
在webpack.config.js中配置webpack-dev-server。
```
module.exports = merge(common, {   //合并两个webpack文件
  devServer: {
    port: 8000,
    contentBase: path.join(__dirname, "dist"),
    compress: true,  // 对所有的服务器资源采用gzip压缩
    hot: true,                     //模块热加载
    inline: true,
    open: 'Chrome',                //构建完成时自动打开浏览器
    openPage: "",
    stats: "errors-only", // 只打印错误
    historyApiFallback: true
  },
  devtool: "inline-source-map",      //方便调试，将src目录下的资源映射到浏览器中
  ···
});
```

## 在项目中使用React
安装react及react-dom
react-dom负责维护虚拟树和react负责维护组件生命周期
```
npm install --Save react react-dom
```
安装react需要注意在webpack.config.js中配置module规则处理jsx文件。
```
···
  module: {
    rules: [
      {
        //处理jsx,js
        test: /\.(jsx?)$/,
        use: {
          loader: "babel-loader",
          ···
        }
      },
      ···
```
同时还有安装其他解析插件处理es6、class、@装饰器等等
`npm install --save-dev @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime @babel/plugin-proposal-decorators @babel/plugin-proposal-class-properties babel-plugin-import`
创建文件`.babelrc`加入解析插件
```
{
  "presets": [
      "@babel/preset-env",
      "@babel/react"
  ],
  "plugins": ["@babel/transform-runtime",
    ["@babel/plugin-proposal-decorators", {"legacy": true}],
    "@babel/plugin-proposal-class-properties",
    ["import", { "libraryName": "antd", "libraryDirectory": "es", "style": "css" }] //配置antd
  ]
}
```

最后配置package.json启动脚本
```
    ···
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "start": "node_modules/.bin/webpack",
        "dev": "node_modules/.bin/webpack-dev-server  --config ./webpack.config.js --process  --color"
    },
  ···
```