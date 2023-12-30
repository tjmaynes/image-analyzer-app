/** @type {import('next').NextConfig} */
const nextConfig = {}

const {
  setupDevBindings,
} = require('@cloudflare/next-on-pages/__experimental__next-dev')

setupDevBindings({
  kvNamespaces: ['IMAGE_ANALYZER_KV'],
})

module.exports = nextConfig
