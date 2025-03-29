import { BookOpen, Code, FileText, Settings, Users } from "lucide-react"
import { DocsSidebar } from "@/lib/components/layouts/docs-sidebar"

const sidebarItems = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      {
        title: "Introduction",
        href: "/docs/getting-started/introduction",
      },
      {
        title: "Installation",
        href: "/docs/getting-started/installation",
      },
    ],
  },
  {
    title: "Components",
    href: "/docs/components",
    icon: <Code className="h-4 w-4" />,
    items: [
      {
        title: "Button",
        href: "/docs/components/button",
      },
      {
        title: "Dropdown",
        href: "/docs/components/dropdown",
      },
    ],
  },
  {
    title: "API Reference",
    href: "/docs/api",
    icon: <FileText className="h-4 w-4" />,
  },
  {
    title: "Configuration",
    href: "/docs/config",
    icon: <Settings className="h-4 w-4" />,
  },
  {
    title: "Community",
    href: "/docs/community",
    icon: <Users className="h-4 w-4" />,
  },
]

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DocsSidebar items={sidebarItems} />
      <main className="flex-1 px-4 py-12 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>
    </div>
  )
} 