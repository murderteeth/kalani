export default function FieldLabelPair({ 
  label, className, children 
}: { 
  label: React.ReactNode, className?: string, children: React.ReactNode
}) {
  return <div className={`flex flex-col gap-3 ${className}`}>
    <div className="px-2 text-neutral-500">{label}</div>
    {children}
  </div>
}
