import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import type { AstroIntegration } from 'astro'
import matter from 'gray-matter'
import { generateThumbnail } from '../lib/components/content/thumbnail'

async function renderThumbnail(svg: string, outputPath: string): Promise<void> {
  const resvg = new Resvg(svg, {
    background: 'transparent',
    fitTo: { mode: 'width', value: 960 },
  })
  const png = resvg.render()
  await writeFile(outputPath, png.asPng())
}

async function buildBlogMetadataMap() {
  const blogDir = join(process.cwd(), 'content/blog')
  const allBlogFiles = await readdir(blogDir)
  const blogFiles = allBlogFiles.filter(
    (f) => (f.endsWith('.mdx') || f.endsWith('.md')) && f !== 'index.mdx',
  )
  const blogMap = new Map<string, { title: string; description: string; thumbnail?: string }>()
  for (const file of blogFiles) {
    const content = await readFile(join(blogDir, file), 'utf8')
    const { data } = matter(content)
    if (data.permalink) {
      blogMap.set(data.permalink, {
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
      })
    }
  }
  return blogMap
}

async function generateBlogThumbnails(
  blogMap: Map<string, { title: string; description: string; thumbnail?: string }>,
  outputDir: string,
  logger: { info: (msg: string) => void; warn: (msg: string) => void },
) {
  const tasks = [...blogMap.entries()]
    .filter(([, data]) => !data.thumbnail)
    .map(([slug, data]) => async () => {
      const thumbnail = await generateThumbnail('Blog', data.title)
      const location = join(outputDir, 'blog', slug)
      await mkdir(location, { recursive: true })
      await renderThumbnail(thumbnail, join(location, 'thumbnail.png'))
      logger.info(`Thumbnail generated for blog/${slug}`)
    })

  await Promise.all(
    tasks.map(async (task) => {
      try {
        await task()
      } catch (error) {
        logger.warn(`Failed to generate thumbnail: ${error}`)
      }
    }),
  )
}

export function buildDocIntegration(): AstroIntegration {
  return {
    name: '@explainer/renderer',
    hooks: {
      'astro:config:setup': async ({ logger }) => {
        const blogMap = await buildBlogMetadataMap()
        const publicDir = join(process.cwd(), 'public')
        await generateBlogThumbnails(blogMap, publicDir, logger)
      },
      'astro:build:done': async ({ pages, logger }) => {
        logger.info('Starting doc thumbnail generation')

        // Collect doc thumbnail tasks
        const docTasks = pages
          .filter((element) => element.pathname.startsWith('docs/'))
          .map((element) => async () => {
            const file = element.pathname.replace('docs/', '').replace(/\/$/, '')
            const { data } = matter(
              await readFile(join(process.cwd(), 'content/docs', `${file}.mdx`), 'utf8'),
            )

            const thumbnail = await generateThumbnail(
              file.split('/').at(0),
              data.title,
              data.description,
            )

            const location = join(process.cwd(), 'dist', 'docs')
            await mkdir(join(location, file), { recursive: true })
            await renderThumbnail(thumbnail, join(location, file, 'thumbnail.png'))
            logger.info(`Thumbnail generated for docs/${file}`)
          })

        await Promise.all(
          docTasks.map(async (task) => {
            try {
              await task()
            } catch (error) {
              logger.warn(`Failed to generate thumbnail: ${error}`)
            }
          }),
        )
      },
    },
  }
}
