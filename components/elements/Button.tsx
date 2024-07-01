import { ThemeName } from '@/lib/types'
import React, { forwardRef, ButtonHTMLAttributes } from 'react'
import GlowGroup from './GlowGroup'
import { cn } from '@/lib/shadcn'

export type Hierarchy = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  theme?: ThemeName
  h?: Hierarchy
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, theme, h, children, ...props }, ref) => {
  const bg = h === 'secondary' ? 'bg-neutral-950' : 'bg-orange-950'
  const text = h === 'secondary' ? 'text-neutral-300' : 'text-neutral-0'
  const border = h === 'secondary' ? 'border-neutral-800' : 'border-transparent'

  return <GlowGroup>
    <button ref={ref} {...props} className={cn(`
      relative h-8 px-8 py-5 flex items-center justify-center
      border ${border} ${bg} text-lg ${text}
      group-hover:text-violet-300 group-hover:bg-neutral-900 group-hover:border-violet-300
      group-active:text-violet-400 group-active:border-violet-400
      disabled:bg-neutral-950 disabled:text-neutral-600 
      disabled:group-hover:border-primary-950 disabled:group-hover:text-primary-950
      disabled:group-hover:bg-neutral-950
      disabled:cursor-default disabled:border-transparent
      cursor-pointer rounded-primary whitespace-nowrap
      ${`theme-${theme ?? 'default'}`}
      ${className}`)}>
      {children}
    </button>
  </GlowGroup>
})

Button.displayName = 'Button'

export default Button
