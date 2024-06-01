import { merge } from 'webpack-merge';
import base from './webpack.config.mjs';

const config = merge(base, {
  mode: 'development',
  devServer: {
    host: 'localhost',
    port: '40992',
  },
});

export default config;
