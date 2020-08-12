import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';

const PROD = process.env.NODE_ENV === 'production';

const config = {
  input: 'src/index.ts',
  external: ['axios'],
  output: {
    file: `dist/happy-axios${PROD ? '.min' : ''}.js`,
    format: 'umd',
    name: 'happyAxios',
    sourcemap: true,
    globals: {
      axios: 'axios',
    },
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    typescript({ module: 'CommonJS' }),
    commonjs({ extensions: ['.ts'], exclude: 'node_modules/**' }),
  ],
};

if (PROD) {
  config.plugins.push(
    uglify.uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
      },
    }),
  );
}

export default config;
