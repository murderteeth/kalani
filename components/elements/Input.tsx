import { cn } from '@/lib/shadcn'
import { ThemeName } from '@/lib/types'
import React, { forwardRef, InputHTMLAttributes } from 'react'
import GlowGroup from './GlowGroup'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string
  theme?: ThemeName
}

export const InputClassName = cn(`
relative w-full px-6 py-3 text-lg
bg-neutral-950 border border-neutral-800
placeholder:text-neutral-500
group-hover:text-violet-300 group-hover:bg-neutral-950 group-hover:border-violet-300
group-has-[:focus]:text-violet-400 group-has-[:focus]:border-violet-400 focus:bg-black
disabled:text-neutral-400 disabled:bg-transparent hover:disabled:border-neutral-950
disabled:placeholder-neutral-800 disabled:border-transparent
outline-none focus:ring-0 focus:outline-none
rounded-primary`)

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, theme, ...props }, ref) => {
  return <GlowGroup className={`rounded-primary theme-${theme ?? 'default'}`}>
    <input ref={ref} {...props} className={cn(InputClassName, className)} />
  </GlowGroup>
})

Input.displayName = 'Input'

export default Input
