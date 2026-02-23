import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import matter from "gray-matter";
import { mkdir, readFile, writeFile } from "node:fs/promises";
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

        // Generate doc thumbnails
        const docPaths = pages
          .filter((element) => element.pathname.startsWith("docs/"))
          .map((element) => element.pathname);

        await Promise.all(
          docPaths.map(async (path) => {
            try {
              const file = join(path.replace("docs/", "").replace(/\/$/, ""));
              const { data } = await readFile(
                join(process.cwd(), "content/docs", `${file}.mdx`),
                "utf8",
              ).then(matter);

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
            } catch (error) {
              logger.warn(`Failed to generate thumbnail for ${path}: ${error}`);
            }
          }),
        );

        // Generate blog thumbnails
        const blogPaths = pages
          .filter((element) => element.pathname.startsWith("blog/"))
          .filter((element) => element.pathname !== "blog/")
          .map((element) => element.pathname);

        await Promise.all(
          blogPaths.map(async (path) => {
            try {
              const slug = path.replace("blog/", "").replace(/\/$/, "");

              // Find the matching blog MDX file by permalink
              const { readdirSync, readFileSync } = await import("node:fs");
              const blogDir = join(process.cwd(), "content/blog");
              const files = readdirSync(blogDir).filter(
                (f) => f.endsWith(".mdx") || f.endsWith(".md"),
              );

              let blogData: { title?: string; description?: string } | null =
                null;
              for (const file of files) {
                const content = readFileSync(join(blogDir, file), "utf8");
                const { data } = matter(content);
                if (data.permalink === slug) {
                  blogData = data;
                  break;
                }
              }

              if (!blogData) return;

              const thumbnail = await generateThumbnail(
                "Blog",
                blogData.title,
                blogData.description,
              );

              const location = join(process.cwd(), "dist", "blog", slug);
              await mkdir(location, { recursive: true });
              await renderThumbnail(thumbnail, join(location, "thumbnail.png"));
              logger.info(`Thumbnail generated for blog/${slug}`);
            } catch (error) {
              logger.warn(
                `Failed to generate blog thumbnail for ${path}: ${error}`,
              );
            }
          }),
        );
      },
    },
  };
}
