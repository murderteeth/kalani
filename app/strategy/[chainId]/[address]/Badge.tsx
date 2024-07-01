import { useMemo } from 'react'
import { IconType } from 'react-icons/lib'
import { PiCheck, PiX } from 'react-icons/pi'

export default function Badge({
  label,
  icon: Icon,
  enabled,
}: {
  label: string,
  icon: IconType,
  enabled?: boolean
}) {
  const fillClassName = useMemo(() => enabled ? 'fill-secondary-400' : 'fill-neutral-800', [enabled])
  const labelClassName = useMemo(() => enabled ? 'text-secondary-400' : 'text-neutral-700', [enabled])
  return <div className="flex flex-col items-center">
    <div className={`p-3 rounded-primary`}>
      <Icon size={64} className={fillClassName} />
    </div>
    <div className="flex items-center gap-2 text-sm">
      {enabled && <PiCheck size={16} className={fillClassName} />}
      {!enabled && <PiX size={16} className={fillClassName} />}
      <div className={labelClassName}>{label}</div>
    </div>
  </div>
}
