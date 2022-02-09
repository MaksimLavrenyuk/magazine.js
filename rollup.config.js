import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import eslint from '@rbnlffl/rollup-plugin-eslint';

const pkg = require('./package.json');

const { version } = pkg;
const isProduction = process.env.NODE_ENV !== 'development';

export default {
    input: ['src/index.ts'],
    output: {
        file: 'dist/js/magazine.js',
        format: 'iife',
        sourcemap: true,
        banner: /*! ${version} */,
        name: 'magazine',
    },
    watch: {
        include: ['src/'],
        exclude: ['node_modules/'],
    },
    plugins: [
        eslint({
            throwOnError: isProduction,
            throwOnWarning: isProduction,
        }),
        typescript(),
        isProduction ? terser({
            compress: {
                pure_funcs: ['console.log'],
            },
            output: {
                comments: (node, comment) => comment.line === 1,
            },
        }) : {},
    ],
};
