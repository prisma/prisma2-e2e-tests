// I will bundle node_modules
// const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node',
  
  // I will bundle node_modules
  // externals: [nodeExternals()],

  // https://webpack.js.org/configuration/node/
  // webpack patches __dirname which causes string_encoding/ to not be resolved
  // uncomment to make that error go
  // node: false
}
