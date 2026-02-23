import { isDocSection, type DocSection, type DocTreeNode } from "@/utils";
import { useEffect, useState } from "react";
import Collapsible from "./collapsible";
import DocSwitcher from "./doc-switcher";

function usePathname(initial: string) {
  const [pathname, setPathname] = useState(initial);

  useEffect(() => {
    const update = () => setPathname(window.location.pathname);
    document.addEventListener("astro:after-swap", update);
    return () => document.removeEventListener("astro:after-swap", update);
  }, []);

  return pathname;
}

function flattenPages(nodes: DocTreeNode[]): { id: string }[] {
  return nodes.flatMap((node) =>
    isDocSection(node) ? flattenPages(node.children) : [node],
  );
}

type Props = {
  documentations: DocTreeNode[];
  currentPathname: string;
};

export default function Sidebar(props: Props) {
  const pathname = usePathname(props.currentPathname);

  const currentCollection = props.documentations.find((element) => {
    if (!isDocSection(element)) return false;
    const pages = flattenPages(element.children);
    return pages.some((item) => pathname.startsWith(`/docs/${item.id}`));
  }) as DocSection | undefined;

  return (
    <>
      {props.documentations.length > 1 && currentCollection && (
        <div className="px-5 2xl:px-0 mb-10">
          <DocSwitcher
            current={currentCollection}
            items={props.documentations}
          />
        </div>
      )}

      <div className="px-5 2xl:px-0 space-y-3 mb-3 lg:mb-6 -mx-1 lg:mx-0 flex flex-col gap-4">
        {currentCollection?.children.map((children) => (
          <Collapsible
            key={children.id}
            currentPathname={pathname}
            item={children as DocSection}
          />
        ))}
      </div>
    </>
  );
}
