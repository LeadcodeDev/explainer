import { Resvg } from "@resvg/resvg-js";
import type { AstroIntegration } from "astro";
import matter from "gray-matter";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateThumbnail } from "../lib/components/content/thumbnail";

export function buildDocIntegration(): AstroIntegration {
  return {
    name: "@explainer/renderer",
    hooks: {
      "astro:build:done": async ({ pages, logger }) => {
        logger.info("Starting thumbnail generation");
        const docPaths = pages
          .filter((element) => element.pathname.startsWith("docs/"))
          .map((element) => element.pathname);

        await Promise.all(
          docPaths.map(async (path) => {
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
            await mkdir(join(location, file), {
              recursive: true,
            });

            const resvg = new Resvg(thumbnail, {
              background: "transparent",
              fitTo: { mode: "width", value: 960 },
            });

            const png = resvg.render();
            await writeFile(join(location, file, "thumbnail.png"), png.asPng());
            logger.info(`Thumbnail generated for ${file}`);
          }),
        );
      },
    },
  };
}
