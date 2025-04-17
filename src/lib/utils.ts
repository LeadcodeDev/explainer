import type { CollectionKey } from 'astro:content'
import { clsx, type ClassValue } from "clsx"
import type { LucideProps } from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

type NavbarCollection = {
  label: string
  items: NavbarItem[]
}

type NavbarItem = {
  label: string
  description: string
  href: string
}

type ExplainerMeta = {
  title: string
  description: string
  thumbnail: string
}

type ExplainerDocs = {
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
  label: string
  href: string
  baseUrl: string
}

type ExplainerConfig = {
  meta: ExplainerMeta
  docs: { [key in CollectionKey]?: ExplainerDocs }
  navbar: NavbarCollection[],
}

export function defineExplainerConfig(config: ExplainerConfig) {
  return config
}
