import { Fragment, useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "@/hooks/use-theme";
import { Icon } from "@iconify/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Kbd, KbdGroup } from "../ui/kbd";

type Props = {
  items: any[];
};

export function SearchCommand(props: Props) {
  const { setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Fragment>
      <InputGroup
        className="max-w-[400px] bg-background cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <InputGroupAddon align="inline-start">
          <Icon icon="lucide:search" />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search" />
        <InputGroupAddon align="inline-end">
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <span>+</span>
            <Kbd>k</Kbd>
          </KbdGroup>
        </InputGroupAddon>
      </InputGroup>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          {props.items.map((doc) => {
            return (
              <CommandGroup key={doc.id} heading={doc.data.label}>
                {doc.children.map((page: any) => (
                  <CommandItem key={page.id} asChild>
                    <a href={`/docs/${page.id}`} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Icon icon={page.data.icon} />
                        <span className="whitespace-nowrap">
                          {page.data.title}
                        </span>
                      </div>
                      <p className="text-muted/50 truncate">
                        {page.content.remarkPluginFrontmatter.description}
                      </p>
                    </a>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}

          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem asChild>
              <button
                onClick={() => setTheme("light")}
                className="w-full cursor-pointer"
              >
                <Icon icon="lucide:sun" />
                <span>Light</span>
              </button>
            </CommandItem>
            <CommandItem asChild>
              <button
                onClick={() => setTheme("dark")}
                className="w-full cursor-pointer"
              >
                <Icon icon="lucide:moon" />
                <span>Dark</span>
              </button>
            </CommandItem>
            <CommandItem asChild>
              <button
                onClick={() => setTheme("system")}
                className="w-full cursor-pointer"
              >
                <Icon icon="lucide:laptop" />
                <span>System</span>
              </button>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
}
