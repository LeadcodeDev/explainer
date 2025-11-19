import * as CollapsiblePrimitives from "@/components/ui/collapsible";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useState, type PropsWithChildren } from "react";

type Props = {
  defaultOpen?: boolean;
  currentPathname: string;
  item: any;
};

export default function Collapsible(props: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(props.defaultOpen ?? true);

  return (
    <CollapsiblePrimitives.Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 w-full"
    >
      <CollapsiblePrimitives.CollapsibleTrigger asChild>
        <div className="flex items-center justify-between w-full px-2.5 gap-1.5 text-sm text-secondary-foreground font-medium cursor-pointer">
          <p className="truncate">{props.item.data.label}</p>
        </div>
      </CollapsiblePrimitives.CollapsibleTrigger>
      <CollapsiblePrimitives.CollapsibleContent className="flex flex-col pl-5 ml-1">
        {props.item.children.map((item) => {
          if (item.children) {
            return (
              <div
                key={item.id}
                className="group relative w-full px-2.5 py-1.5 flex items-center gap-1.5 text-sm after:absolute after:-left-1.5 after:inset-y-0 after:block after:w-px after:transition-colors after:bg-muted/25 dark:after:bg-neutral-700 text-muted/75 dark:text-neutral-400"
              >
                <Collapsible
                  item={item}
                  currentPathname={props.currentPathname}
                />
              </div>
            );
          }

          return (
            <a
              key={item.id}
              href={`/docs/${item.id}`}
              className={clsx(
                "group relative w-full px-2.5 py-1.5 flex items-center gap-1.5 text-sm after:absolute after:-left-1.5 after:inset-y-0 after:block after:w-px after:transition-colors",
                props.currentPathname.startsWith(`/docs/${item.id}`)
                  ? "text-primary after:bg-primary after:z-1 after:rounded-full"
                  : "after:bg-muted/25 dark:after:bg-neutral-700 text-muted/75 dark:text-neutral-400",
              )}
            >
              <Icon
                icon={item.data.icon}
                className={clsx(
                  "shrink-0 size-4 mr-1",
                  props.currentPathname.startsWith(`/docs/${item.href}`)
                    ? "text-primary"
                    : "group-data-[state=open]:text-muted-foreground",
                )}
              />
              {item.data.title}
            </a>
          );
        })}
      </CollapsiblePrimitives.CollapsibleContent>
    </CollapsiblePrimitives.Collapsible>
  );
}
