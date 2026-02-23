import { type DocSection, type DocTreeNode, cn, isDocSection } from '@/utils'
import { Icon } from '@iconify/react'
import { useEffect, useState } from 'react'
import Collapsible from './collapsible'
import DocSwitcher from './doc-switcher'

function usePathname(initial: string) {
  const [pathname, setPathname] = useState(initial)

  useEffect(() => {
    const update = () => setPathname(window.location.pathname)
    document.addEventListener('astro:after-swap', update)
    return () => document.removeEventListener('astro:after-swap', update)
  }, [])

  return pathname
}

function flattenPages(nodes: DocTreeNode[]): { id: string }[] {
  return nodes.flatMap((node) => (isDocSection(node) ? flattenPages(node.children) : [node]))
}

type Props = {
  documentations: DocTreeNode[]
  currentPathname: string
}

export default function Sidebar(props: Props) {
  const pathname = usePathname(props.currentPathname)

  const currentCollection = props.documentations.find((element) => {
    if (!isDocSection(element)) return false
    const pages = flattenPages(element.children)
    return pages.some((item) => pathname.startsWith(`/docs/${item.id}`))
  }) as DocSection | undefined

  return (
    <>
      {props.documentations.length > 1 && currentCollection && (
        <div className="px-5 2xl:px-0 mb-10">
          <DocSwitcher current={currentCollection} items={props.documentations} />
        </div>
      )}

      <div className="px-5 2xl:px-0 space-y-3 mb-3 lg:mb-6 -mx-1 lg:mx-0 flex flex-col gap-4">
        {currentCollection?.children.map((child) =>
          isDocSection(child) ? (
            <Collapsible key={child.id} currentPathname={pathname} item={child} />
          ) : (
            <a
              key={child.id}
              href={`/docs/${child.id}`}
              className={cn(
                'flex items-center gap-1.5 text-sm px-2.5 py-1.5',
                pathname.startsWith(`/docs/${child.id}`)
                  ? 'text-primary'
                  : 'text-muted/75 dark:text-neutral-400',
              )}
            >
              <Icon
                icon={child.data.icon ?? 'lucide:file-text'}
                width={16}
                height={16}
                className="shrink-0 mr-1"
              />
              {child.data.title}
            </a>
          ),
        )}
      </div>
    </>
  )
}
