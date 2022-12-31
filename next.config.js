/** @type {import('next').NextConfig} */
const { i18n } = require("./i18n.config");
const nextConfig = {
  basePath: "/editor/pro",
  assetPrefix: "/editor/pro",
  i18n,
  publicRuntimeConfig: {
    basePath: "/editor/pro",
  },
  reactStrictMode: false,
  devIndicators: {
    buildActivity: false,
  },
  images: {
    loader: "akamai",
    path: "",
  },
};

module.exports = nextConfig;
