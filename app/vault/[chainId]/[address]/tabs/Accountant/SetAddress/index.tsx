import FieldLabelPair from '@/components/FieldLabelPair'
import Section from '@/components/Section'
import { Combo } from './Combo'
import Button from '@/components/elements/Button'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress, EvmAddressSchema, ROLES, compareEvmAddresses } from '@/lib/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import accountants, { TaggedAccountant } from './accountants'
import { useVaultFromParams } from '@/hooks/useVault'
import abis from '@/lib/abis'
import { getAddress, zeroAddress } from 'viem'
import { z } from 'zod'
import { useWriteContract } from '@/hooks/useWriteContract'
import Link from '@/components/elements/Link'
import { fEvmAddress } from '@/lib/format'
import Sticker from '@/components/elements/Sticker'

function useWrite(
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  }, 
  next: string | undefined, 
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: contract.address,
    args: [getAddress(enabled ? next! : zeroAddress)],
    abi: contract.abi,
    functionName: contract.set,
    query: { enabled }
  }), [contract, next, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function SetAddress({ 
  next, setNext,
  isNextValid, setIsNextValid,
  changed, setChanged
}: {
  next: string | undefined,
  setNext: (next: string | undefined) => void,
  isNextValid: boolean,
  setIsNextValid: (isNextValid: boolean) => void,
  changed: boolean,
  setChanged: (changed: boolean) => void
}) {
  const { isConnected, chainId, address } = useAccount()
  const vault = useVaultFromParams()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [roles, setRoles] = useState<bigint | undefined>(undefined)

  const filter = useMemo(() => {
    if (!isConnected) return []
    return accountants.filter((accountant: TaggedAccountant) => {
      return accountant.chainId === chainId
    })
  }, [isConnected, chainId])

  const multicall = useReadContracts({ contracts: [
    { address: vault?.address ?? zeroAddress, abi: abis.vault, functionName: 'accountant' },
    { address: vault?.address ?? zeroAddress, abi: abis.vault, functionName: 'roles', args: [address ?? zeroAddress] }
  ]})

  useEffect(() => {
    if (multicall.data?.every(d => d.status === 'success')) {
      setPrevious(EvmAddressSchema.parse(multicall.data![0].result))
      let mask = z.bigint({ coerce: true }).parse(multicall.data![1].result)
      setRoles(mask)
    } else {
      setPrevious(undefined)
      setRoles(undefined)
    }
  }, [multicall, setPrevious, setRoles])

  const permitted = useMemo(() => Boolean(roles && (roles & ROLES.ACCOUNTANT_MANAGER) === ROLES.ACCOUNTANT_MANAGER), [roles])

  useEffect(() => {
    setNext(previous ?? '')
    setIsNextValid(!!previous)
  }, [setNext, setIsNextValid, previous])

  useEffect(() => {
    setChanged(Boolean(((previous || next) && !compareEvmAddresses(previous, next))))
  }, [previous, next, setChanged])

  const { 
    simulation, write, confirmation, resolveToast
  } = useWrite({
    abi: abis.vault,
    address: vault?.address ?? zeroAddress,
    get: 'accountant',
    set: 'set_accountant'
  }, next, isConnected && changed && isNextValid)

  const inputTheme = useMemo(() => {
    if (multicall.isFetching) return 'sim'
    return 'default'
  }, [multicall])

  const disableInput = useMemo(() => 
    !permitted
    || multicall.isFetching,
  [permitted, multicall])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    return 'default'
  }, [simulation, write, confirmation])

  const disableButton = useMemo(() => 
    !permitted
    || !isNextValid 
    || !changed
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [permitted, isNextValid, changed, simulation, write, confirmation])

  useEffect(() => {
    if (confirmation.isSuccess && EvmAddressSchema.safeParse(next).success) {
      setPrevious(EvmAddressSchema.parse(next))
      resolveToast()
      write.reset()
    }
  }, [confirmation, setPrevious, next, resolveToast, write])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Section>
    <FieldLabelPair label="Accountant">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <div className={`grow theme-${inputTheme} p-1 rounded-primary`}>
            <Combo
              previous={previous}
              next={next}
              setNext={setNext}
              isValid={isNextValid}
              setIsValid={setIsNextValid}
              options={filter.map(o => o.address)}
              disabled={disableInput} />
          </div>
          <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="w-field-btn h-field-btn">Set</Button>
        </div>
        <div className="flex">
          {isNextValid && <Sticker href={`/accountant/${chainId}/${next}`} className="inline-flex items-center gap-2">
            Manage {fEvmAddress(EvmAddressSchema.parse(next))}
          </Sticker>}
          {!isNextValid && <div>&nbsp;</div>}
        </div>
      </div>
    </FieldLabelPair>
  </Section>
}

export default SetAddress
