import { roleClassNames } from './roleClassNames'

export default function Dot({ 
  role, checked
}: { 
  role: string, 
  checked?: boolean
}) {

  const roleClassName = roleClassNames[role as keyof typeof roleClassNames] ?? {}

  return <div className={`
    size-4 flex items-center gap-2 rounded-full
    ${checked ? roleClassName.dot : 'bg-neutral-900'}`} />
}
