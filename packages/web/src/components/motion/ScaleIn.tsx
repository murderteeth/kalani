import { useMemo } from 'react'
import { motion, Transition } from 'framer-motion'
import { springs } from '../../lib/motion'
import { useMounted } from '../../hooks/useMounted'

export default function ScaleIn({ 
  _key,
  transition = springs.roll,
  waitForMount,
  children 
}: { 
  _key: string,
  transition?: Transition,
  waitForMount?: boolean,
  children: React.ReactNode 
}) {
  const mounted = useMounted()
  const initial = useMemo(() => 
    (!waitForMount || mounted) ? { scale: 0, opacity: 0 } : false, 
  [waitForMount, mounted])
  return <motion.div key={`motion-${_key}`}
    transition={transition}
    initial={initial}
    animate={{ scale: 1, opacity: 1 }} >
    {children}
  </motion.div>
}
