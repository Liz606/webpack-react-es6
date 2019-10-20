const path = require("path"); 
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    devServer: {
      port: 9090,
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
        })
    ]
}