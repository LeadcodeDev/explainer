import { defineExplainerConfig } from '@/utils'
import { BookDashedIcon, BookIcon } from 'lucide-react'

export default defineExplainerConfig({
  meta: {
    title: 'Explainer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'https://placehold.co/1200x630',
  },
  docs: {
    main: {
      icon: BookDashedIcon,
      label: 'Main',
      href: '/docs/main/welcome',
      baseUrl: '/docs/main',
    },
    test: {
      icon: BookIcon,
      label: 'Test',
      href: '/docs/test/welcome',
      baseUrl: '/docs/test',
    },
  },
  blog: {
    defaults: {
      thumbnail: 'https://placehold.co/1200x630',
    },
    authors: {
      leadcode_dev: {
        name: 'LeadcodeDev',
        avatar: 'https://avatars.githubusercontent.com/u/8946317?v=4',
        href: 'https://github.com/LeadcodeDev',
      },
    }
  },
  navbar: {
    github: 'https://github.com/LeadcodeDev/explainer',
    items: [
      {
        label: 'Docs',
        items: [
          {
            label: 'Welcome',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '/docs/main/welcome',
          },
          {
            label: 'Getting Started',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '/docs/main/getting-started',
          },
          {
            label: 'Components',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '/docs/main/components',
          },
          {
            label: 'Layouts',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '/docs/main/layouts',
          },
          {
            label: 'Routing',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            href: '/docs/main/routing',
          },
        ],
      },
    ]
  },
})