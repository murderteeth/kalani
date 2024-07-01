'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Connect from '../Connect'
import Home from './Home'
import Finder from '../Finder'
import { useAccount } from 'wagmi'

function Header() {
  const { isConnected } = useAccount()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`
      fixed inset-x-0 top-0 z-50 w-full
      ${isScrolled ? 'bg-primary-900/40 backdrop-blur' : ''}`}
    >
      <div className="mx-auto max-w-6xl h-20 flex items-center justify-between">
        <div className="grow flex items-center justify-start gap-12">
          <Home />
					{(isConnected || pathname !== '/') && 
            <Finder 
              className="w-[32rem]" 
              inputClassName="px-4 py-2 border-transparent" 
              placeholder="address / vault / token" />
          }
        </div>
        <div className={`flex items-center justify-end`}>
          <Connect />
        </div>
      </div>
    </header>
  )
}

export default Header
