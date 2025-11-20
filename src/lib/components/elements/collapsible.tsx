import * as CollapsiblePrimitives from "@/components/ui/collapsible";
import { Icon } from "@iconify/react";
import clsx from "clsx";
import { useState, type PropsWithChildren } from "react";

type Props = {
  defaultOpen?: boolean;
  currentPathname: string;
  item: any;
  isNestedElement?: boolean;
};

export default function Collapsible(props: PropsWithChildren<Props>) {
  const [isOpen, setIsOpen] = useState(
    (props.defaultOpen ?? props.isNestedElement)
      ? props.currentPathname.startsWith(
          `/docs/${props.item.id.replace("/_default", "")}`,
        )
      : true,
  );

  return (
    <CollapsiblePrimitives.Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex flex-col gap-2 w-full"
    >
      <CollapsiblePrimitives.CollapsibleTrigger asChild>
        <div
          className={clsx(
            "flex items-center w-full gap-1.5 text-sm font-medium cursor-pointer justify-between",
            isOpen
              ? "text-muted-foreground"
              : "text-muted/75 dark:text-neutral-400",
          )}
        >
          <div className="flex items-center gap-1.5">
            {props.isNestedElement && (
              <Icon
                icon={props.item.data.icon}
                className={clsx(
                  "shrink-0 size-4 mr-1",
                  isOpen
                    ? "text-muted-foreground"
                    : "text-muted/75 dark:text-neutral-400",
                )}
              />
            )}
            <p className="truncate">{props.item.data.label}</p>
          </div>
          {props.isNestedElement && (
            <Icon
              icon="lucide:chevron-down"
              className={clsx(
                "shrink-0 size-4 mr-1",
                props.currentPathname.startsWith(`/docs/${props.item.id}`)
                  ? "text-primary"
                  : "group-data-[state=open]:text-muted-foreground",
              )}
            />
          )}
        </div>
      </CollapsiblePrimitives.CollapsibleTrigger>
      <CollapsiblePrimitives.CollapsibleContent className="flex flex-col pl-5 ml-1">
        {props.item.children.map((item: any) => {
          if (item.children) {
            return (
              <div
                key={item.id}
                className="group relative w-full px-2.5 py-1.5 flex items-center gap-1.5 text-sm after:absolute after:-left-1.5 after:inset-y-0 after:block after:w-px after:transition-colors after:bg-muted/25 dark:after:bg-secondary text-muted/75 dark:text-neutral-400"
              >
                <Collapsible
                  item={item}
                  currentPathname={props.currentPathname}
                  isNestedElement={true}
                />
              </div>
            );
          }

          return (
            <a
              key={item.id}
              href={`/docs/${item.id}`}
              className={clsx(
                "group relative w-full px-2.5 py-1.5 flex items-center gap-1.5 text-sm after:absolute after:inset-y-0 after:block after:w-px after:transition-colors",
                props.isNestedElement ? "after:-left-4" : "after:-left-1.5",
                props.currentPathname.startsWith(`/docs/${item.id}`)
                  ? "text-primary after:bg-primary after:z-1 after:rounded-full"
                  : "after:bg-muted/25 dark:after:bg-secondary text-muted/75 dark:text-neutral-400",
              )}
            >
              <Icon
                icon={item.data.icon}
                className={clsx(
                  "shrink-0 size-4 mr-1",
                  props.currentPathname.startsWith(`/docs/${item.id}`)
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
