const path = require('path');
const webpack = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: './src/js/index.js',
  plugins: [
    new webpack.DefinePlugin({
      'typeof CANVAS_RENDERER': JSON.stringify(true),
      'typeof WEBGL_RENDERER': JSON.stringify(false)
    }),
    // TODO copy all contents over to the dist
    new CopyPlugin({
       patterns: [
        { from: "./src", to: "./",
          globOptions: {
            gitignore: true,
            ignore: ["**.DS_Store.**", "**/js/**", "**/scss/**"],
          },
          noErrorOnMissing: true
        },
        { from: "./src/index.html", to: "./index.html" },
       ]
    }),
  ],
  output: {
    filename: './js/[name].bundle.min.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  module: {
    rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'dist/'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.json$/i,
        type: "asset/resource",
      }
    ]
  },
};
