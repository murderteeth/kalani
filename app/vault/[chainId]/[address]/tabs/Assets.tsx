import { useVaultFromParams } from '@/hooks/useVault'
import { div, mulb } from '@/lib/bmath'
import { fBps, fPercent, fTokens } from '@/lib/format'
import { useMemo } from 'react'

export default function Assets() {
  const vault = useVaultFromParams()
  const idle = useMemo(() => (vault?.totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault])
  const allocated = useMemo(() => vault?.strategies.reduce((acc, strategy) => acc + Number(strategy.targetDebtRatio), 0) ?? 0, [vault])
  const deployed = useMemo(() => {
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, allocated / 10_000)
    return div(vault?.totalDebt ?? 0n, totalAllocated)
  }, [vault, allocated])

  if (!vault) return <></>

  return <div>
    <div className={`
      w-1/2 h-full p-4`}>
      <table className="table-auto w-full">
        <tr>
          <td className="text-xl">Total assets</td>
          <td className="text-right text-xl">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
        </tr>
        <tr>
          <td>Allocated</td>
          <td className="text-right">{fBps(allocated)}</td>
        </tr>
        <tr>
          <td>Deployed</td>
          <td className="text-right">{fPercent(deployed)}</td>
        </tr>
        <tr>
          <td>Idle assets</td>
          <td className="text-right">{fTokens(idle, vault.asset.decimals)}</td>
        </tr>
        <tr>
          <td>Deposit limit</td>
          <td className="text-right">{fTokens(vault.deposit_limit, vault.asset.decimals, { fixed: 0 })}</td>
        </tr>
        <tr>
          <td>Performance fee</td>
          <td className="text-right">{fBps(vault.fees.performanceFee)}</td>
        </tr>
      </table>
    </div>
  </div>
}
