const { withSentryConfig } = require("@sentry/nextjs");
const webpack = require("webpack");

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};

const sentryConfig = {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Suppresses source map uploading logs during build
  silent: true,

  org: "student-6aadc151d",
  project: "javascript-nextjs",
};

const webpackConfig = {
  // Add the DefinePlugin to set FLUENTFFMPEG_COV to false
  plugins: [
    new webpack.DefinePlugin({
      "process.env.FLUENTFFMPEG_COV": JSON.stringify(false),
    }),
  ],
};

module.exports = withSentryConfig(nextConfig, sentryConfig, webpackConfig);
