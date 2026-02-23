import { getCollection } from 'astro:content'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import config from '../../explainer.config'

export async function GET(context: APIContext) {
  const posts = await getCollection('blog')
  const publishedPosts = posts
    .filter((post) => post.id !== 'index')
    .filter((post) => !post.data.draft)
    .filter((post) => post.data.publishedAt && new Date(post.data.publishedAt) <= new Date())

  return rss({
    title: config.seo.title,
    description: config.seo.description,
    site: context.site ?? 'https://example.com',
    items: publishedPosts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt ? new Date(post.data.publishedAt) : new Date(),
      link: `/blog/${post.data.permalink}`,
    })),
  })
}
