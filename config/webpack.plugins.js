const webpack = require('webpack');
const cssnano = require('cssnano');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
// const RobotstxtPlugin = require('robotstxt-webpack-plugin');
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const ESLintPlugin = require('eslint-webpack-plugin');


const config = require('./site.config');

// Optimize CSS assets
const optimizeCss = new CssMinimizerPlugin({
  // assetNameRegExp: /\.css$/g,
  // cssProcessor: cssnano,
  // cssProcessorPluginOptions: {
  //   preset: [
  //     'default',
  //     {
  //       discardComments: {
  //         removeAll: true,
  //       },
  //     },
  //   ],
  // },
});

// TODO enable robots.txt once RobotstxtPlugin will support Webpack 5
//     "robotstxt-webpack-plugin": "^7.0.0",
// Generate robots.txt
// const robots = new RobotstxtPlugin({
//   sitemap: `${config.site_url}/sitemap.xml`,
//   host: config.site_url,
// });

// Clean webpack
const clean = new CleanWebpackPlugin();

// Stylelint
const stylelint = new StyleLintPlugin();

// Extract CSS
const cssExtract = new MiniCssExtractPlugin({
  filename: 'style.[contenthash].css',
});

// HTML generation
const paths = [];
const generateHTMLPlugins = () => glob.sync('./src/**/*.html').map((dir) => {
  const filename = path.basename(dir);

  if (filename !== '404.html') {
    paths.push(filename);
  }

  return new HTMLWebpackPlugin({
    filename,
    template: path.join(config.root, config.paths.src, filename),
    meta: {
      viewport: config.viewport,
    },
  });
});

// Sitemap
const sitemap = new SitemapPlugin({
  base: config.site_url,
  paths: paths,
  options: {
    priority: 1.0,
    lastmod: true,
  }
});

// Favicons
const favicons = new FaviconsWebpackPlugin({
  logo: config.favicon,
  prefix: 'images/favicons/',
  favicons: {
    appName: config.site_name,
    appDescription: config.site_description,
    developerName: null,
    developerURL: null,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: false,
      coast: false,
      favicons: true,
      firefox: false,
      windows: false,
      yandex: false,
    },
  },
});

// Webpack bar
const webpackBar = new WebpackBar({
  color: '#ff6469',
});

// Google analytics
const CODE = `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id={{ID}}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{ID}}');
</script>
`;

class GoogleAnalyticsPlugin {
  constructor({ id }) {
    this.id = id;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('GoogleAnalyticsPlugin', (compilation) => {
      HTMLWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'GoogleAnalyticsPlugin',
        (data, cb) => {
          data.html = data.html.replace('</head>', `${CODE.replace(/{{ID}}/g, this.id) }</head>`);
          cb(null, data);
        },
      );
    });
  }
}

const google = new GoogleAnalyticsPlugin({
  id: config.googleAnalyticsUA,
});

module.exports = [
  clean,
  stylelint,
  cssExtract,
  ...generateHTMLPlugins(),
  fs.existsSync(config.favicon) && favicons,
  config.env === 'production' && optimizeCss,
  // TODO enable robots
  // config.env === 'production' && robots,
  config.env === 'production' && sitemap,
  config.googleAnalyticsUA && google,
  webpackBar,
  new ESLintPlugin(),
].filter(Boolean);
