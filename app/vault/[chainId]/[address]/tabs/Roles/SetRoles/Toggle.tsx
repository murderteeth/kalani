import { PiCheck, PiX } from 'react-icons/pi'
import { roleClassNames } from './roleClassNames'

export default function Toggle({ 
  role, checked, disabled, onClick 
}: { 
  role: string, 
  checked?: boolean,
  disabled?: boolean,
  onClick?: () => void
}) {

  const roleClassName = roleClassNames[role as keyof typeof roleClassNames] ?? {}

  return <div onClick={() => {if (!disabled) onClick?.()}} className={`
    py-2 px-4 flex items-center gap-2
    border rounded-primary
    ${disabled ? 'cursor-default' : 'cursor-pointer'}
    ${roleClassName.defaults} ${checked ? roleClassName.checked : roleClassName.unchecked}`}>
    {checked ? <PiCheck /> : <PiX className="opacity-35" />}
    {role.replace('_MANAGER', '').replace('_', ' ')}
  </div>
}
