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
  current: any;
  items: any[];
};

export default function DocSwitcher(props: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="lg"
          variant="outline"
          className="border-0 !bg-transparent !px-0 w-full !ring-0 shadow-none"
        >
          <div className="bg-primary text-secondary flex aspect-square size-8 items-center justify-center rounded-lg">
            <Icon icon={props.current.data.icon} className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-secondary-foreground text-sm leading-tight">
            <span className="truncate font-medium">
              {props.current.data.label}
            </span>
            <span className="truncate text-xs opacity-60">
              {props.current.data.description}
            </span>
          </div>
          <Icon icon="lucide:chevron-down" className="ml-auto text-muted" />
        </Button>
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
        {props.items.map((element) => (
          <DropdownMenuItem
            key={element.id}
            // onClick={() => setActiveTeam(team)}
            className="gap-2 p-2 text-muted"
          >
            <div className="flex size-6 items-center justify-center rounded-md border">
              <Icon icon={element.data.icon} className="size-3.5 shrink-0" />
            </div>
            {element.data.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
