import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";

export type CodeGroupProps = {
  labels?: string | string[];
  languages?: string | string[];
  codes?: string | string[];
};

export default function CodeGroupComponent({
  children,
  labels: propLabels,
  languages: propLanguages,
  codes: propCodes,
}: PropsWithChildren<CodeGroupProps>) {
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<
    { label: string; language: string; icon: string }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseProp = (prop: any) => {
    if (Array.isArray(prop)) return prop;
    if (typeof prop === "string") {
      try {
        return JSON.parse(prop);
      } catch {
        return [];
      }
    }
    return [];
  };

  const parsedCodes = parseProp(propCodes);
  const parsedLabels = parseProp(propLabels);
  const parsedLanguages = parseProp(propLanguages);

  const isPropsMode = parsedCodes.length > 0;

  useEffect(() => {
    if (isPropsMode || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll("pre");
    const newTabs: typeof tabs = [];

    elements.forEach((el, index) => {
      const label =
        el.getAttribute("data-label") ||
        el.getAttribute("title") ||
        el.getAttribute("data-language") ||
        `Tab ${index + 1}`;

      const language = el.getAttribute("data-language") || "text";

      newTabs.push({
        label,
        language,
        icon: getCurrentIcon(label, language),
      });
    });

    if (JSON.stringify(newTabs) !== JSON.stringify(tabs)) {
      setTabs(newTabs);
    }
  }, [children, isPropsMode]);

  useEffect(() => {
    if (isPropsMode || !containerRef.current) return;

    const elements = containerRef.current.querySelectorAll("pre");

    elements.forEach((el, index) => {
      if (!(el instanceof HTMLElement)) return;

      const shouldShow = index === activeTab;

      el.style.display = shouldShow ? "block" : "none";

      const parent = el.parentElement;
      if (parent && parent.tagName === "P" && parent.children.length === 1) {
        parent.style.display = shouldShow ? "block" : "none";
      }
    });
  }, [activeTab, isPropsMode, tabs]);

  function getCurrentIcon(label?: string, language?: string) {
    if (!label && !language) return "mdi:code-tags";

    const labelBase = label?.toLowerCase();
    const languageBase = language?.toLowerCase();

    return (
      icons[labelBase as keyof typeof icons] ||
      icons[languageBase as keyof typeof icons] ||
      "mdi:code-tags"
    );
  }

  // Render for Props Mode (rehype plugin generated)
  if (isPropsMode) {
    const tabsData = parsedCodes.map((code: string, i: number) => ({
      label: parsedLabels[i] || parsedLanguages[i] || "Code",
      language: parsedLanguages[i],
      content: code,
    }));

    return (
      <div className="code-group border rounded-md overflow-hidden mb-5 bg-background">
        <div className="flex p-2 border-b gap-2 overflow-x-auto">
          {tabsData.map((tab: any, i: number) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={clsx(
                "relative inline-flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer whitespace-nowrap focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus:outline-none",
                activeTab === i
                  ? "bg-tab-container text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              type="button"
            >
              <Icon icon={getCurrentIcon(tab.label, tab.language)} width={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        <div className="code-group-content">
          <div
            dangerouslySetInnerHTML={{ __html: parsedCodes[activeTab] || "" }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="code-group border rounded-md overflow-hidden mb-5 bg-background">
      {tabs.length > 0 && (
        <div className="flex p-2 border-b gap-2 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={clsx(
                "relative inline-flex items-center gap-1.5 text-default px-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus:outline-none transition-colors cursor-pointer",
                activeTab === i && "bg-tab-container",
                activeTab !== i && "hover:bg-[var(--bg-tab-container)]",
              )}
              type="button"
            >
              <Icon icon={tab.icon} width={16} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      )}
      <div ref={containerRef} className="code-group-content">
        {children}
      </div>
    </div>
  );
}

const icons = {
  markdown: "devicon:markdown",
  mdx: "devicon:markdown",
  html: "devicon:html5",
  css: "devicon:css3",
  javascript: "devicon:javascript",
  js: "devicon:javascript",
  typescript: "devicon:typescript",
  ts: "devicon:typescript",
  python: "devicon:python",
  py: "devicon:python",
  dart: "devicon:dart",
  rust: "catppuccin:rust",
  rs: "catppuccin:rust",
  npm: "devicon:npm",
  yarn: "devicon:yarn",
  pnpm: "devicon:pnpm",
  bun: "devicon:bun",
  vite: "devicon:vite",
  "tailwind.config.js": "devicon:tailwindcss",
  "tailwind.config.ts": "devicon:tailwindcss",
  react: "devicon:react",
  nextjs: "devicon:nextjs",
  svelte: "devicon:svelte",
  vue: "devicon:vuejs",
  go: "devicon:go",
  bash: "devicon:bash",
  sh: "devicon:bash",
  shell: "devicon:bash",
  sql: "devicon:azuresqldatabase",
  yaml: "devicon:yaml",
  yml: "devicon:yaml",
  json: "devicon:json",
  dockerfile: "devicon:docker",
  git: "devicon:git",
  github: "devicon:github",
  gitlab: "devicon:gitlab",
};
