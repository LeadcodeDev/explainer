import { defineExplainerConfig } from '@/utils'
import { BookDashedIcon, BookIcon } from 'lucide-react'

export default defineExplainerConfig({
  meta: {
    title: 'Explainer',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    thumbnail: 'https://placehold.co/1200x630',
  },
  urls: {
    github: 'https://github.com/LeadcodeDev/explainer',
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
  navbar: [
    {
      label: 'Docs',
      items: [
        {
          label: 'Main documentation',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          href: '/docs/main/welcome',
        },
        {
          label: 'Test documentation',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
          href: '/docs/test/welcome',
        },
      ],
    },
    {
      label: 'API',
      href: '/api',
    },
    {
      label: 'Blog',
      href: '/blog',
    },
  ]
})