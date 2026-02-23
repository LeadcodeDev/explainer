import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useEffect, useRef, useState, type PropsWithChildren } from "react";
import config from "../../../../../explainer.config";

export type CodeGroupProps = {
  labels?: string | string[];
  languages?: string | string[];
  codes?: string | string[];
};

export default function CodeGroupComponent(
  props: PropsWithChildren<CodeGroupProps>,
) {
  const icons = config.content.icons;
  const [activeTab, setActiveTab] = useState(0);
  const [tabs, setTabs] = useState<
    { label: string; language: string; icon: string }[]
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const parseProp = (prop: string | string[] | undefined): string[] => {
    if (Array.isArray(prop)) return prop;
    if (typeof prop === "string") {
      try {
        return JSON.parse(prop) as string[];
      } catch {
        return [];
      }
    }
    return [];
  };

  const parsedCodes = parseProp(props.codes);
  const parsedLabels = parseProp(props.labels);
  const parsedLanguages = parseProp(props.languages);

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

      let icon = getCurrentIcon(label, language);

      if (["bash", "sh", "shell"].includes(language.toLowerCase())) {
        const text = el.textContent?.trim() || "";
        const match = text.replace(/^\$\s*/, "").match(/^(\w+)/);
        if (match) {
          const cmd = match[1].toLowerCase();
          if (["npm", "npx", "pnpm", "yarn", "bun"].includes(cmd)) {
            const cmdIcon = icons[cmd as keyof typeof icons];
            if (cmdIcon) icon = cmdIcon;
          }
        }
      }

      newTabs.push({
        label,
        language,
        icon,
      });
    });

    if (JSON.stringify(newTabs) !== JSON.stringify(tabs)) {
      setTabs(newTabs);
    }
  }, [props.children, isPropsMode]);

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
    const tabsData = parsedCodes.map((code: string, i: number) => {
      const language = parsedLanguages[i] || "text";
      const label = parsedLabels[i] || language || "Code";
      let icon = getCurrentIcon(label, language);

      if (["bash", "sh", "shell"].includes(language.toLowerCase())) {
        const text = code.replace(/<[^>]+>/g, "").trim();
        const match = text.replace(/^\$\s*/, "").match(/^(\w+)/);
        if (match) {
          const cmd = match[1].toLowerCase();
          if (["npm", "pnpm", "yarn", "bun"].includes(cmd)) {
            const cmdIcon = icons[cmd as keyof typeof icons];
            if (cmdIcon) icon = cmdIcon;
          }
        }
      }

      return {
        label,
        language,
        icon,
        content: code,
      };
    });

    return (
      <div className="code-group border rounded-md overflow-hidden mb-5 bg-background">
        <div className="flex p-2 border-b gap-2 overflow-x-auto">
          {tabsData.map((tab, i) => (
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
              <Icon icon={tab.icon} width={16} />
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
        {props.children}
      </div>
    </div>
  );
}
