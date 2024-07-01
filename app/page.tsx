'use client'

import Wordmark from '@/components/Wordmark'
import Finder from '@/components/Finder'
import { useAccount } from 'wagmi'
import Account from './account/[address]/Account'

export default function Home() {
  const { address } = useAccount()

  if (address) return <Account address={address} />

  return <main className="relative w-full min-h-screen">
    <div className={`
      w-6xl max-w-6xl mx-auto pt-[6rem]
      flex flex-col items-center justify-start gap-8`}>
      <div className="w-full h-full pt-32 flex flex-col sm:flex-row sm:justify-center gap-16">
        <div className="w-full sm:w-1/2 h-full flex flex-col items-center justify-center gap-16">
          <div className="flex flex-col items-center justify-end gap-3">
            <Wordmark className="px-12 py-2 text-5xl">Kalani</Wordmark>
            <p>Yearn vault automations</p>
          </div>
          <Finder className="w-full" placeholder='Search by address / vault / token' />
        </div>
      </div>
    </div>
  </main>
}
