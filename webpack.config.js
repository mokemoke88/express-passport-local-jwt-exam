/**
 * @file webpack.config.js
 */

const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    service: [
      path.resolve( path.join(__dirname, 'src', 'index.ts') )
    ],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve( path.join(__dirname, 'dist') ),
    publicPath: 'dist',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          /*
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [ 'env', {
                  'modules': false,
                  'useBuiltIns': true,
                }]
              ],
            },
          },
          */
          'ts-loader',
        ] // use
      } // .ts | .tsx
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.jsx',
    ]
  }
}
