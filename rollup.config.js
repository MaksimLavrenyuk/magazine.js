import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import html2 from 'rollup-plugin-html2';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import eslint from '@rbnlffl/rollup-plugin-eslint';
import del from 'rollup-plugin-delete';

const pkg = require('./package.json');

const { version } = pkg;
const isProduction = process.env.NODE_ENV !== 'development';
const isDevelopment = process.env.NODE_ENV === 'development';

export default {
  input: ['src/index.ts'],
  output: {
    dir: 'dist',
    format: 'iife',
    sourcemap: true,
    banner: `/*! ${version} */`,
    name: 'magazine',
  },
  watch: {
    include: ['src/**'],
    exclude: ['node_modules/**'],
  },
  plugins: [
    eslint({
      throwOnError: isProduction,
      throwOnWarning: isProduction,
    }),
    typescript(),
    isDevelopment
        ?  serve({
          open: true,
          contentBase: './dist',
          historyApiFallback: true,
        })
        : {},
    isDevelopment
        ? livereload({
            watch: './dist',
        })
        : {},
    html2({
      template: './src/assets/index.html',
    }),
    isProduction
      ? terser({
        compress: {
          pure_funcs: ['console.log'],
        },
        output: {
          comments: (node, comment) => comment.line === 1,
        },
      })
      : {},
    del({ runOnce: true, targets: 'dist/*' }),
  ],
};
