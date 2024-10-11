const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const TerserWebpackPlugin = require("terser-webpack-plugin")

const isDev = process.env.MODE === "development" || process.env.MODE === "dev"
const PORT = process.env.PORT || 3000
const MODE_DEV = isDev ?? "development"

/**
 * Returns babel options with provided presets. If no presets are provided,
 * defaults to @babel/preset-env.
 *
 * @param {...string} preset - Presets to be used by babel
 * @return {object} - Babel options
 */
function getBabelOpts(...preset) {
  const opts = {
    presets: ["@babel/preset-env"],
  }

  if (preset.length > 0) {
    opts.presets.push(...preset)
  }

  return opts
}

/**
 * Returns optimization options for webpack. If isDev is true, it disables
 * minimization. Otherwise, it uses TerserWebpackPlugin for minification.
 *
 * @return {object} - Optimization options
 */
function getOptimization() {
  const config = {
    splitChunks: {
      chunks: "all",
    },
  }

  if (!isDev) {
    config.minimizer = [new TerserWebpackPlugin()]
  }
  return config
}

/**
 * Returns style loaders for webpack, given an array of presets.
 *  If scss is included, it adds sass-loader to the array.
 * @param {array} preset - Array of presets,  'scss', or both.
 * @return {array} - Array of style loaders.
 */
function getStyleLoaders(...preset) {
  const config = [
    isDev ? "style-loader" : MiniCssExtractPlugin.loader,
    "css-loader",
    "postcss-loader",
  ]

  if (preset.findIndex((ext) => ext === "scss") !== -1) {
    config.push("sass-loader")
  }
  return config
}

/**
 * Returns an object containing an array of module rules for webpack.
 * If "scss" is included, it adds support for scss/sass files.
 * If "xml" is included, it adds support for xml files.
 * If "csv" is included, it adds support for csv files.
 * If "ts" is included, it adds support for typescript files.
 * If "react" is included, it adds support for react files.
 *
 * @param {...string} addSupportFiles - Array of file extensions to add
 *   support for.
 * @return {object} - Object containing an array of module rules.
 */
function getModuleRules(...addSupportFiles) {
  const config = {
    rules: [
      {
        test: /\.css$/,
        use: getStyleLoaders(),
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/,
        use: ["file-loader"],
      },
      {
        test: /\.(ttf|woff|eot|woff2)$/,
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: getBabelOpts(),
          },
        ],
      },
    ],
  }

  if (addSupportFiles.findIndex((ext) => ext === "scss") !== -1) {
    const presets = ["scss"]

    config.rules.push({
      test: /\.s[ac]ss$/,
      use: getStyleLoaders(...presets),
    })
  }

  if (addSupportFiles.findIndex((ext) => ext === "xml") !== -1) {
    config.rules.push({
      test: /\.xml$/,
      use: ["xml-loader"],
    })
  }

  if (addSupportFiles.findIndex((ext) => ext === "csv") !== -1) {
    config.rules.push({
      test: /\.csv$/,
      use: ["csv-loader"],
    })
  }

  if (addSupportFiles.findIndex((ext) => ext === "ts") !== -1) {
    config.rules.push({
      test: /\.ts$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: getBabelOpts("ts"),
        },
      ],
    })
  }
  if (addSupportFiles.findIndex((ext) => ext === "react") !== -1) {
    config.rules.push({
      test: /\.jsx$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "babel-loader",
          options: getBabelOpts("@babel/preset-react"),
        },
      ],
    })
  }

  return config
}

module.exports = {
  context: path.resolve(__dirname, "."),
  entry: {
    main: ["@babel/polyfill", "./src/index.js"],
  },
  mode: MODE_DEV ? "development" : "production",
  output: {
    filename: "[name].[hash].js",
    path: __dirname + "/dist",
    asyncChunks: true,
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".scss", ".css"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: PORT,
    open: true,
    hot: true,
  },
  optimization: getOptimization(),
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      minify: {
        collapseWhitespace: isDev ? false : true,
        removeComments: isDev ? false : true,
      },
    }),
    new CleanWebpackPlugin(),
    // раскомментировать при первом запуске со статикой
    new CopyWebpackPlugin({
      patterns: [
        {
          // for static files
          from: path.resolve(__dirname, "src/assets"),
          to: path.resolve(__dirname, "dist/assets"),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
    }),
  ],
  module: getModuleRules("scss"),
}
