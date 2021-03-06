const webpack = require("webpack")
const path = require("path")
const LiveReloadPlugin = require("webpack-livereload-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
const env = require("yargs").argv.mode
const chartModulesPath = path.resolve("./src/charts")
const fixturesPath = path.resolve("./test/fixtures")
const vendorsPath = path.resolve("./node_modules")
const bundleIndexPath = path.resolve("./src/bundle.js")

const isProduction = env === "prod"
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin
const projectName = "mapd3"

const defaultJSLoader = {
  test: /\.js$/,
  loader: "babel",
  exclude: /(node_modules)/,
  query: {
    presets: ["es2015", "stage-0"]
  }
}
const babelLoader = {
  test: /\.js$/,
  include: /src/,
  exclude: /(node_modules)/,
  loader: "babel",
  query: {
    presets: ["es2015", "stage-0"],
    cacheDirectory: true
  }
}
const plugins = [
      // Uncomment this line to see bundle composition analysis
      // new BundleAnalyzerPlugin()
]


// Set up minification for production
if (isProduction) {
  plugins.push(new UglifyJsPlugin({minimize: false}))
}

const config = {

  // Test configuration for Karma runner
  test: {
    resolve: {
      root: [chartModulesPath, fixturesPath],
      alias: {
        d3: `${vendorsPath}/d3`
      }
    },
    module: {
      preLoaders: [babelLoader],
      loaders: [defaultJSLoader]
    },

    plugins
  },

  // Creates a bundle with all mapd3
  prod: {
    entry: {
      mapd3: bundleIndexPath
    },

    devtool: "source-map",

    output: {
      path: "dist",
      filename: `${projectName}.min.js`,
      library: ["mapd3"],
      libraryTarget: "umd"
    },

    externals: {
      // "d3/build/d3": "d3/build/d3"
    },

    module: {
      loaders: [defaultJSLoader]
    },

    plugins
  },

  dev: {
    entry: {
      mapd3: bundleIndexPath
    },

    devtool: "eval",

    output: {
      path: "dist",
      filename: `${projectName}.js`,
      library: ["mapd3"],
      libraryTarget: "umd"
    },

    externals: {
      // "d3/build/d3": "d3/build/d3"
    },

    module: {
      loaders: [defaultJSLoader]
    }
  }
}

module.exports = config[env]
