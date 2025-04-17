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
  navbar: [
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
    {
      label: 'Resources',
      items: [
        {
          label: 'Blog',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          href: '/blog',
        },
      ],
    },
  ],
})