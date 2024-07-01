import React, { ReactNode } from 'react'
import Link, { LinkProps } from 'next/link'
import { cn } from '@/lib/shadcn'
import GlowGroup from './GlowGroup'

type StickerProps = LinkProps & {
  className?: string,
  children: ReactNode,
}

const stickerClassName = `
px-8 py-2
border border-transparent
bg-neutral-950 text-neutral-400
group-hover:bg-black group-hover:border-secondary-300 group-hover:text-secondary-300
group-active:text-violet-400 group-active:border-violet-400
rounded-primary`

const Sticker: React.FC<StickerProps> = ({ className, children, href, ...props }) => (
  <GlowGroup>
    <Link href={href} className={cn(stickerClassName, className)} {...props}>
      {children}
    </Link>
  </GlowGroup>
)

export default Sticker
