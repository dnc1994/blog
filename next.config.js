const slug = require('rehype-slug')

module.exports = require('@zeit/next-mdx')({
  options: {
    hastPlugins: [
      slug
    ]
  }
})({
  pageExtensions: ['jsx', 'js', 'md', 'mdx'],
  experimental: {
    rewrites() {
      return [
        {
          source: '/feed.xml',
          destination: '/_next/static/feed.xml'
        }
      ];
    }
  }
})
