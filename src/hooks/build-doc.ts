import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import matter from "gray-matter";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateThumbnail } from "../lib/components/content/thumbnail";

async function renderThumbnail(svg: string, outputPath: string): Promise<void> {
  const resvg = new Resvg(svg, {
    background: "transparent",
    fitTo: { mode: "width", value: 960 },
  });
  const png = resvg.render();
  await writeFile(outputPath, png.asPng());
}

export function buildDocIntegration(): AstroIntegration {
  return {
    name: "@explainer/renderer",
    hooks: {
      "astro:build:done": async ({ pages, logger }) => {
        logger.info("Starting thumbnail generation");

        // Build blog metadata map upfront (permalink → { title, description })
        const blogDir = join(process.cwd(), "content/blog");
        const allBlogFiles = await readdir(blogDir);
        const blogFiles = allBlogFiles.filter(
          (f) => (f.endsWith(".mdx") || f.endsWith(".md")) && f !== "index.mdx",
        );
        const blogMap = new Map<
          string,
          { title: string; description: string; thumbnail?: string }
        >();
        for (const file of blogFiles) {
          const content = await readFile(join(blogDir, file), "utf8");
          const { data } = matter(content);
          if (data.permalink) {
            blogMap.set(data.permalink, {
              title: data.title,
              description: data.description,
              thumbnail: data.thumbnail,
            });
          }
        }

        // Collect doc thumbnail tasks
        const docTasks = pages
          .filter((element) => element.pathname.startsWith("docs/"))
          .map((element) => async () => {
            const file = element.pathname
              .replace("docs/", "")
              .replace(/\/$/, "");
            const { data } = matter(
              await readFile(
                join(process.cwd(), "content/docs", `${file}.mdx`),
                "utf8",
              ),
            );

            const thumbnail = await generateThumbnail(
              file.split("/").at(0),
              data.title,
              data.description,
            );

            const location = join(process.cwd(), "dist", "docs");
            await mkdir(join(location, file), { recursive: true });
            await renderThumbnail(
              thumbnail,
              join(location, file, "thumbnail.png"),
            );
            logger.info(`Thumbnail generated for docs/${file}`);
          });

        // Collect blog thumbnail tasks
        const blogTasks = pages
          .filter((element) => element.pathname.startsWith("blog/"))
          .filter((element) => element.pathname !== "blog/")
          .map((element) => async () => {
            const slug = element.pathname
              .replace("blog/", "")
              .replace(/\/$/, "");
            const blogData = blogMap.get(slug);
            if (!blogData || blogData.thumbnail) return;

            const thumbnail = await generateThumbnail(
              "Blog",
              blogData.title,
              blogData.description,
            );

            const location = join(process.cwd(), "dist", "blog", slug);
            await mkdir(location, { recursive: true });
            await renderThumbnail(thumbnail, join(location, "thumbnail.png"));
            logger.info(`Thumbnail generated for blog/${slug}`);
          });

        // Run ALL thumbnails in a single batch so Vite module runner stays active
        const allTasks = [...docTasks, ...blogTasks];
        await Promise.all(
          allTasks.map(async (task) => {
            try {
              await task();
            } catch (error) {
              logger.warn(`Failed to generate thumbnail: ${error}`);
            }
          }),
        );
      },
    },
  };
}
