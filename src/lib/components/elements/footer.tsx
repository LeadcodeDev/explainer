import { Icon } from "@iconify/react";
import config from "explainer.config";

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-10 lg:px-8">
        <div className="mt-16 flex justify-center gap-x-5">
          {Object.entries(config.socials.media).map(([key, url]) => {
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800"
              >
                <span className="sr-only">{key}</span>
                {config.socials.icons &&
                key.toLowerCase() in config.socials.icons ? (
                  <Icon
                    icon={config.socials.icons[key.toLowerCase()]}
                    aria-hidden="true"
                    className="size-6"
                  />
                ) : (
                  key
                )}
              </a>
            );
          })}
        </div>
        <p className="mt-10 text-center text-sm/6 text-gray-600">
          &copy; {new Date().getFullYear()} {config.seo.title}, Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
