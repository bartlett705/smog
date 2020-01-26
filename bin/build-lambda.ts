#! /usr/bin/env ts-node

import { writeFileSync } from 'fs'
import path = require('path')
import webpack = require('webpack')
import nodeExternals = require('webpack-node-externals')

webpack(
  {
    entry: path.resolve(__dirname, '../lambda/index.ts'),
    output: {
      path: path.resolve(__dirname, '../lambda/build'),
      filename: 'index.js',
      // These next two keep index.handler intact for the lambda runtime to find.
      library: 'index',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [{ test: /\.ts$/, use: 'ts-loader' }]
    },
    mode: 'production',
    resolve: {
      extensions: ['.js', '.ts', '.json']
    },
    externals: [nodeExternals(), /^[aws|^querystring$]/],
    target: 'async-node'
  },
  (err: Error | any, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }

    const info = stats.toJson()

    if (stats.hasErrors()) {
      console.error(info.errors)
    }

    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }

    console.info(
      `Webpack lambda build done in ${info.time} ms. Total chunks (size): ${
        info.chunks?.length
      } (${(
        info.chunks?.reduce((size, chunk) => size + chunk.size, 0) || 0 / 1024
      ).toFixed(2)})`
    )

    writeFileSync('webpack-stats.json', JSON.stringify(info, null, 2))
  }
)
