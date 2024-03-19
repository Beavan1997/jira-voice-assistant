const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
// const tailwindcss = require('tailwindcss')
// const autoprefixer = require('autoprefixer')

module.exports = {
  entry: {
    popup: path.resolve('src/Popup.jsx'),
    // options: path.resolve('src/options/index.tsx'),
    // background: path.resolve('src/background/background.ts'),
    contentScript: path.resolve('src/ContentScript.js'),
    // newTab: path.resolve('src/tabs/index.tsx'),
  },
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      // {
      //   test: /\.css$/i,
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         importLoaders: 1,
      //       },
      //     },
      //     {
      //       loader: 'postcss-loader', // postcss loader needed for tailwindcss
      //       options: {
      //         postcssOptions: {
      //           ident: 'postcss',
      //           plugins: [tailwindcss, autoprefixer],
      //         },
      //       },
      //     },
      //   ],
      // },
      {
        test: /\.(svg|png)$/,
        use: ['url-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  "plugins": [
    new CopyPlugin({
      patterns: [{
        from: 'public'
      },
      // {
      //   from: path.resolve('src/assets/microphone.png'),
      //   to: path.resolve('dist')
      // },
      ]
    }),
    new HtmlPlugin({
      template: './src/popup.html',
      filename: 'popup.html'
    })
  ],
};
