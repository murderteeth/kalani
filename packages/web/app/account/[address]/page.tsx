'use client'

import { useVaults } from '@/hooks/useVaults'
import { fEvmAddress, fNumber } from '@/lib/format'
import { EvmAddressSchema } from '@/lib/types'
import { useParams } from 'next/navigation'
import ValueLabelPair from '../../../components/ValueLabelPair'
import Screen from '@/components/Screen'
import Pie from 'lib/components/viz/Pie'
import Tile from './Tile'

export default function Page() {
  const params = useParams()
  const account = EvmAddressSchema.parse(params.address)
  const user = useVaults(account)
  const aum = user?.vaults.reduce((acc, vault) => acc + vault.tvl.close, 0) ?? 0
  const chains = Array(new Set(user?.vaults.map(vault => vault.chainId) ?? []))
  const pieData = user?.vaults.map(vault => ({ label: vault.asset.symbol, value: vault.tvl.close })) ?? []

  if (!account) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-2/3 h-48 p-4 flex flex-col justify-center gap-2 rounded">
        <div className="text-sm">account</div>
        <div className="text-5xl">{fEvmAddress(account)}</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value={fNumber(aum)} label="aum" className="text-4xl" />
          <ValueLabelPair value={String(user?.vaults.length ?? 0)} label="vaults" className="text-4xl" />
        </div>
      </div>
      <Screen className={`
        w-1/3 h-48 flex items-center justify-center
        bg-violet-400`}>
        <Pie data={pieData} size={200} />
      </Screen>
    </div>
    {user?.vaults.map((vault, i) => <Tile key={i} vault={vault} />)}
  </main>
}