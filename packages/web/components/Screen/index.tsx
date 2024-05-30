import Scanlines from './Scanlines'

export default function Screen({ 
  className, 
  onClick, 
  children
}: { 
  className?: string, 
  onClick?: () => void,
  children?: React.ReactNode 
}) {
  return <div onClick={onClick} className={`
    relative rounded-primary
    ${className ?? 'bg-neutral-900 text-neutral-300'}`}>
    {children ?? <></>}
    <Scanlines />
    <div className={`absolute inset-0 shadow-[inset_0px_0px_32px_2px_rgba(23,6,2,1.00)] rounded-primary pointer-events-none`} />
  </div>
}
