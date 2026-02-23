import { Fragment, useEffect, useState } from 'react'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { useTheme } from '@/hooks/use-theme'
import type { DocPage, DocSection } from '@/utils'
import { Icon } from '@iconify/react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { Kbd, KbdGroup } from '../ui/kbd'

type SearchableDocEntry = DocSection & {
  children: (DocPage & { description: string })[]
}

type Props = {
  items: SearchableDocEntry[]
}

export function SearchCommand(props: Props) {
  const { setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <Fragment>
      <InputGroup
        className="max-w-[400px] bg-background cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <InputGroupAddon align="inline-start">
          <Icon icon="lucide:search" width={16} height={16} />
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
                {doc.children.map((page) => (
                  <CommandItem
                    key={page.id}
                    value={`${page.data.title} ${page.description}`}
                    onSelect={() => {
                      setOpen(false)
                      window.location.href = `/docs/${page.id}`
                    }}
                    className="cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Icon icon={page.data.icon ?? 'lucide:file-text'} width={16} height={16} />
                      <span className="whitespace-nowrap">{page.data.title}</span>
                    </div>
                    <p className="text-muted/50 truncate">{page.description}</p>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}

          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem
              value="theme light"
              onSelect={() => {
                setTheme('light')
                setOpen(false)
              }}
              className="cursor-pointer"
            >
              <Icon icon="lucide:sun" width={16} height={16} />
              <span>Light</span>
            </CommandItem>
            <CommandItem
              value="theme dark"
              onSelect={() => {
                setTheme('dark')
                setOpen(false)
              }}
              className="cursor-pointer"
            >
              <Icon icon="lucide:moon" width={16} height={16} />
              <span>Dark</span>
            </CommandItem>
            <CommandItem
              value="theme system"
              onSelect={() => {
                setTheme('system')
                setOpen(false)
              }}
              className="cursor-pointer"
            >
              <Icon icon="lucide:laptop" width={16} height={16} />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Fragment>
  )
}
