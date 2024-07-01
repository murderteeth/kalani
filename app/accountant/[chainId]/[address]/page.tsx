'use client'

import { fEvmAddress } from '@/lib/format'
import { getChain } from '@/lib/chains'
import { Accountant, withAccountant } from '@/hooks/useAccountant'
import Admins from './Admins'

function Page({ accountant }: { accountant: Accountant }) {
  if (!accountant) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-1/2 h-48 p-4 flex flex-col justify-center gap-2 rounded">
        <div className="text-sm">accountant</div>
        <div className="text-5xl">{fEvmAddress(accountant.address)}</div>
        <div className="flex items-center gap-12">
          <div>
            <div>[{getChain(accountant.chainId).name}]</div>
          </div>
        </div>
      </div>
      <div className={`w-1/2 h-48 flex items-center justify-center`}>      
      </div>
    </div>
    <Admins />
  </main>
}

export default withAccountant(Page)
