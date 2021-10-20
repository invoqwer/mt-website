import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import NodemonPlugin from 'nodemon-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import {resumeConfig, websiteConfig} from './config.js';

const log = console.log;
const __root = path.resolve();
const appPath = path.join(__root, 'app');

const webpackConfig = (async () => {
  const [wcfg, rcfg] = [await websiteConfig(), await resumeConfig()];
  const resumeDistPath = path.join(__root, wcfg.resumePath, rcfg.distPath);
  const distPath = path.join(__root, wcfg.distPath);

  const env = process.env.NODE_ENV === 'development' ?
    'development' : 'production';
  log(`===== WEBPACK ENV: ${env} =====`);
  const dev = (env === 'development') ? true : false;

  const config = {
    entry: {
      main: path.join(appPath, 'app.js'),
    },
    output: {
      path: (dev) ?
        path.join(appPath, 'assets') :
        distPath,
      filename: '[name].js',
      clean: true,
    },
    mode: env,
    plugins: [
      new MiniCssExtractPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                // url: (dev) ? false : true,
                url: true,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                additionalData: '$env: ' + env + ';',
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
          ],
        },

      ],
    },
  };

  if (env === 'development') {
    config.watchOptions = {
      ignored: /node_modules/,
    };
    config.plugins.push(
        new NodemonPlugin({
          script: './index.js',
          args: ['development'],
          watch: appPath,
          verbose: true,
        }),
    );
  } else if (env === 'production') {
    config.plugins.push(
        new HtmlWebpackPlugin({
          template: path.join(appPath, 'views', 'layout.pug'),
          resumePath: rcfg.resumePath,
          resumePdfPath: rcfg.resumePdfPath,
          minify: false,
          inject: true,
        }),
        new CopyWebpackPlugin({
          patterns: [
            {
              from: resumeDistPath,
              to({context, absoluteFilename}) {
                return path.join(distPath, 'resume');
              },
            },
          ],
        }),
    );
    config.module.rules.push(
        {
          test: /\.pug$/,
          include: path.join(appPath, 'views'),
          use: [
            {
              loader: 'simple-pug-loader',
              options: {
                self: true,
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)$/,
          type: 'asset/resource',
          generator: {
            filename: './assets/[name][ext]',
          },
        },
    );
  }

  // log(config);
  return config;
})();

export default webpackConfig;
