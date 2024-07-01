'use client'

import { useRouter } from 'next/navigation'
import { LogoYearn } from '../icons/LogoYearn'
import GlowGroup from '../elements/GlowGroup'

export default function Home() {
	const router = useRouter()
  return <GlowGroup className={`rounded-full`}>
      <div onClick={() => router.push('/')} className={`
      border border-transparent hover:border-secondary-400
      p-2 bg-neutral-950 rounded-full cursor-pointer`}>
      <LogoYearn className="size-8" back="text-transparent" front="text-neutral-200" />
    </div>
  </GlowGroup>
}
