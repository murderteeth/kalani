import { EvmAddressSchema } from '@/lib/types'
import { useState } from 'react'
import { Vault, withVault } from '@/hooks/useVault'
import SetAddress from './SetAddress'
import Fees from './Fees'
import { useReadContract } from 'wagmi'
import abis from '@/lib/abis'
import { zeroAddress } from 'viem'
import Section from '@/components/Section'
import { PiWarning } from 'react-icons/pi'
import Button from '@/components/elements/Button'

function Accountant({ vault }: { vault: Vault }) {
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)
  const [changed, setChanged] = useState<boolean>(false)

  const accounted = useReadContract({
    address: isNextValid ? EvmAddressSchema.parse(next) : zeroAddress,
    abi: abis.accountant, functionName: 'vaults', args: [vault.address],
    query: { enabled: isNextValid }
  })

  return <div className="flex flex-col gap-8">
    <SetAddress {...{ vault, next, setNext, isNextValid, setIsNextValid, changed, setChanged }} />

    {!changed && !accounted.data && <Section className="flex items-center justify-between border-red-600/40">
      <div className="pl-8 flex items-center gap-6 text-red-300">
        <PiWarning />
        <div>The accountant is set, but the vault has not been added to the accountant.</div>
      </div>
      <Button className="w-field-btn h-field-btn">Add</Button>
    </Section>}

    {accounted.data && <Fees vault={vault} accountant={EvmAddressSchema.parse(next)} />}
  </div>
}

export default withVault(Accountant)
