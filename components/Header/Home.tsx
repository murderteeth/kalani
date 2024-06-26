'use client'

import { useRouter } from 'next/navigation'
import { LogoYearn } from '../icons/LogoYearn'

export default function Home() {
	const router = useRouter()
  return <div onClick={() => router.push('/')} className="p-2 bg-primary-1000/40 rounded-full cursor-pointer">
    <LogoYearn className="size-8" back="text-transparent" front="text-neutral-200" />
  </div>
}
