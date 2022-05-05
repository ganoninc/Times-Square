const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./site.config');

// Define common loader constants
const sourceMap = config.env !== 'production';

// HTML loaders
const html = {
  test: /\.(html)$/,
  use: [
    {
      loader: 'html-loader',
    },
  ],
};

// Javascript loaders
const js = {
  test: /\.js(x)?$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: [],
      },
    },
  ],
};

// Style loaders
const styleLoader = {
  loader: 'style-loader',
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap,
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    // plugins: [
    //   require('autoprefixer')(),
    // ],
    sourceMap,
  },
};

const css = {
  test: /\.css$/,
  use: [
    config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader,
  ],
};

const sass = {
  test: /\.s[c|a]ss$/,
  use: [
    config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
    cssLoader,
    postcssLoader,
    {
      loader: 'sass-loader',
      options: {
        sourceMap,
      },
    },
  ],
};

// const less = {
//   test: /\.less$/,
//   use: [
//     config.env === 'production' ? MiniCssExtractPlugin.loader : styleLoader,
//     cssLoader,
//     postcssLoader,
//     {
//       loader: 'less-loader',
//       options: {
//         sourceMap,
//       },
//     },
//   ],
// };

// Image loaders
const imageLoader = {
  loader: 'image-webpack-loader',
  options: {
    bypassOnDebug: true,
    gifsicle: {
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    pngquant: {
      quality: [0.65, 0.90],
      speed: 4,
    },
    mozjpeg: {
      progressive: true,
    },
  },
};

const images = {
  test: /\.(gif|png|jpe?g|svg)$/i,
  exclude: /fonts/,
  type: 'asset/resource',
  use: config.env === 'production' ? [imageLoader] : [],
};

// Font loaders
// const fonts = {
//   test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
//   exclude: /images/,
//   type: 'asset/resource',
//   use: [
//     // {
//     //   loader: 'file-loader',
//     //   options: {
//     //     name: '[name].[fullhash].[ext]',
//     //     outputPath: 'fonts/',
//     //   },
//     // },
//   ],
// };

// Video loaders
// const videos = {
//   test: /\.(mp4|webm)$/,
//   use: [
//     // {
//     //   loader: 'file-loader',
//     //   options: {
//     //     name: '[name].[fullhash].[ext]',
//     //     outputPath: 'images/',
//     //   },
//     // },
//   ],
//   type: 'asset/resource',
// };

module.exports = [
  html,
  js,
  css,
  sass,
  // less,
  images,
  // fonts,
  // videos,
];
