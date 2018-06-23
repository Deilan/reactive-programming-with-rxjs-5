/***
 * Excerpted from "Reactive Programming with RxJS 5",
 * published by The Pragmatic Bookshelf.
 * Copyrights apply to this code. It may not be used to create training material,
 * courses, books, articles, and the like. Contact us if you are in doubt.
 * We make no guarantees that this code is fit for any purpose.
 * Visit http://www.pragmaticprogrammer.com/titles/smreactjs5 for more book information.
***/
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    index: ["babel-polyfill", "./src/5_show_tweets.js"]
  },

  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "template.html"
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, "src"),
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: { presets: ["env"] }
        }
      }
    ]
  }
};
