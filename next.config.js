/** @type {import('next').NextConfig} */

const { withKeystone } = require("@keystone-6/core/next");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = withKeystone(nextConfig);
