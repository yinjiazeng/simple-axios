const { NODE_ENV, BABEL_ENV } = process.env;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['ie >= 9'],
        },
        modules: BABEL_ENV || false,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: NODE_ENV === 'test' ? ['@babel/transform-modules-commonjs'] : null,
};
