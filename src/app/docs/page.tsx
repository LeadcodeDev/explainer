import { BookOpen, Code, FileText, Settings, Users } from "lucide-react"
import DocsLayout from "@/lib/components/layouts/docs-layout"

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

export default function DocsPage() {
  return (
    <DocsLayout sidebar={sidebarItems}>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1>Documentation</h1>
        <p className="lead">
          Welcome to the documentation. Here you'll find comprehensive guides and documentation to help you start working with our platform as quickly as possible.
        </p>

        <h2>What you'll need</h2>
        <p>
          Before you start, you'll need to have the following installed on your system:
        </p>
        <ul>
          <li>Node.js 18 or later</li>
          <li>npm 7 or later</li>
          <li>Git</li>
        </ul>

        <h2>Quick Start</h2>
        <p>
          To get started, run the following commands in your terminal:
        </p>
        <pre><code>{`npm create my-app
cd my-app
npm install
npm run dev`}</code></pre>
      </div>
    </DocsLayout>
  )
} 