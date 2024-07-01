export default function Section({
  className, children
}: {
  className?: string,
  children: React.ReactNode
}) {
  return <div className={`px-10 py-12 border border-neutral-900 rounded-primary ${className}`}>
    {children}
  </div>
}
