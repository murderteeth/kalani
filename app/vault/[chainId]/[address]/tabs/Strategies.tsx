import { Vault, withVault } from '@/hooks/useVault'

function Strategies({ vault }: { vault: Vault }) {
  return <div className={`w-1/2 h-full p-4`}>
    {vault.strategies.map(strategy => <div key={strategy.address}>
      {strategy.name}
    </div>)}
  </div>
}

export default withVault(Strategies)
