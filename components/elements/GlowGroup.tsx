import { cn } from '@/lib/shadcn'
import React, { forwardRef, BaseHTMLAttributes } from 'react'

type Props = BaseHTMLAttributes<HTMLDivElement> & {
  className?: string
}

const glowGroupClassName = cn(`
absolute -z-[1] -inset-1 rounded-primary blur-lg
opacity-0 bg-gradient-to-r from-secondary-800 via-secondary-900 to-secondary-800
group-hover:opacity-100 
group-active-within:opacity-100
group-[&:has(:disabled)]:opacity-0
`)

const GlowGroup = forwardRef<HTMLDivElement, Props>(({ className, ...props }, ref) => {
  return <div className={cn(`relative group ${className}`)}>
    <div className={glowGroupClassName} />
    {props.children}
  </div>
})

GlowGroup.displayName = 'GlowGroup'

export default GlowGroup
