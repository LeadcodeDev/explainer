import { isDocSection, type DocSection, type DocTreeNode } from "@/utils";
import { Icon } from "@iconify/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  current: DocSection;
  items: DocTreeNode[];
};

function getFirstPageHref(node: DocTreeNode): string | null {
  if (!isDocSection(node)) {
    return `/docs/${node.id}`;
  }
  for (const child of node.children) {
    const href = getFirstPageHref(child);
    if (href) return href;
  }
  return null;
}

export default function DocSwitcher(props: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="border px-2 py-1 rounded-lg">
          <Button
            size="lg"
            variant="outline"
            className="!bg-transparent !border-0 !px-0 w-full !ring-0 shadow-none"
          >
            <div className="bg-primary text-secondary flex aspect-square size-8 items-center justify-center rounded-lg">
              <Icon
                icon={props.current.data.icon ?? "lucide:book-open"}
                width={16}
                height={16}
              />
            </div>
            <div className="grid flex-1 text-left text-secondary-foreground text-sm leading-tight">
              <span className="truncate font-medium">
                {props.current.data.label}
              </span>
              <span className="truncate text-xs opacity-60">
                {props.current.data.description}
              </span>
            </div>
            <Icon
              icon="lucide:chevron-down"
              width={16}
              height={16}
              className="ml-auto text-muted"
            />
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground text-xs">
          Documentations
        </DropdownMenuLabel>
        {props.items.map((element) => {
          const href = getFirstPageHref(element);
          const isCurrent = element.id === props.current.id;
          const icon = isDocSection(element)
            ? (element.data.icon ?? "lucide:book-open")
            : (element.data.icon ?? "lucide:file-text");

          return (
            <DropdownMenuItem
              key={element.id}
              asChild
              className={`gap-2 p-2 ${isCurrent ? "text-primary" : "text-secondary-foreground"}`}
            >
              <a href={href ?? "#"}>
                <div className="flex size-6 items-center justify-center rounded-md border">
                  <Icon
                    icon={icon}
                    width={14}
                    height={14}
                    className="shrink-0"
                  />
                </div>
                {"label" in element.data
                  ? element.data.label
                  : element.data.title}
              </a>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
