const fs = require('fs')
const RSS = require('rss')
const path = require('path')

function generate() {
  const feed = new RSS({
    title: 'Linghao’s Blog',
    site_url: 'https://linghao.io',
    feed_url: 'https://linghao.io/feed.xml'
  })

  const content = []
  fs.readdirSync(path.join(__dirname, 'pages', 'notes')).forEach(function(file) {
    content.push({
      content: fs.readFileSync(path.join(__dirname, 'pages', 'notes', file)).toString(),
      url: `/notes/${file.replace('.mdx', '')}`
    })
  })
  fs.readdirSync(path.join(__dirname, 'pages', 'posts')).forEach(function(file) {
    content.push({
      content: fs.readFileSync(path.join(__dirname, 'pages', 'posts', file)).toString(),
      url: `/posts/${file.replace('.mdx', '')}`
    })
  })

  const metas = content.map(post => {
    return {
      ...post,
      content: post.content.match(/export const meta .+{([^}]+)}/)[1].replace(/\n/g, ''),
    }
  }).map(post => {
    return {
      ...post,
      meta: eval(`({${post.content}})`)
    }
  })

  metas.filter(m => m.meta.date).sort((a, b) => {
    return (new Date(b.meta.date)).getTime() - (new Date(a.meta.date)).getTime()
  }).map(({meta, url}) => {
    feed.item({
      title: meta.title,
      author: meta.author,
      guid: url,
      url,
      date: meta.date,
      description: meta.description
    })
  })

  const rss = feed.xml({ indent: true })
  fs.writeFileSync('./.next/static/feed.xml', rss)
}

generate()
