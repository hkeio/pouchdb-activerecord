const root = require('app-root-path').path;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: `${root}/src/index.ts`,
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/ // Ignore node_modules folder
  ],
  output: {
    filename: 'index.js', // output file
    path: `${root}`,
    libraryTarget: "commonjs"
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    loaders: [{
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      test: /\.tsx?$/,
      exclude: `${root}/node_modules`,
      loader: 'ts-loader'
    }]
  }, plugins: [
    new UglifyJsPlugin({
      parallel: true
    }),
  ]
};
