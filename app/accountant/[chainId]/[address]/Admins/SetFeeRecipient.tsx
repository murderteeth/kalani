import SetAddress from '@/components/SetAddress'
import abis from '@/lib/abis'
import { EvmAddress } from '@/lib/types'
import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export default function SetFeeRecipient({ accountant }: { accountant: EvmAddress }) {
  const { address } = useAccount()

  const feeManager = useReadContract({
    address: accountant,
    abi: abis.accountant,
    functionName: 'feeManager'
  })

  const permitted = useMemo(() => {
    return feeManager.data === address
  }, [address, feeManager])

  return <SetAddress 
    verb="Set" 
    permitted={permitted} 
    contract={{
      address: accountant,
      abi: abis.accountant,
      get: 'feeRecipient',
      set: 'setFeeRecipient'
    }} 
  />
}
