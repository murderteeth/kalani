'use client'

import { z } from 'zod'
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/elements/Button'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { getAddress, zeroAddress } from 'viem'
import InputAddress from '@/components/InputAddress'
import { EvmAddress, EvmAddressSchema, PSEUDO_ROLES } from '@/lib/types'
import { useIsRoleManager } from '@/hooks/useRoleManager'
import { useWriteContract } from '@/hooks/useWriteContract'

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

export default function SetAddress({
  label,
  verb,
  roleMask,
  contract,
  className
}: {
  label: ReactNode,
  verb: string,
  roleMask: bigint,
  contract: {
    address: EvmAddress,
    abi: any,
    get: string,
    set: string
  },
  className?: string 
}) {
  const { isConnected, address } = useAccount()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)
  const [roles, setRoles] = useState<bigint | undefined>(undefined)
  const isRoleManager = useIsRoleManager(contract.address)

  const multicall = useReadContracts({ contracts: [
    { address: contract.address, abi: contract.abi, functionName: contract.get },
    { address: contract.address, abi: contract.abi, functionName: 'roles', args: [address ?? zeroAddress] }
  ]})

  useEffect(() => {
    if (multicall.data?.every(d => d.status === 'success')) {
      setPrevious(EvmAddressSchema.parse(multicall.data![0].result))
      let mask = z.bigint({ coerce: true }).parse(multicall.data![1].result)
      if (isRoleManager) { mask |= PSEUDO_ROLES.ROLE_MANAGER }
      setRoles(mask)
    } else {
      setPrevious(undefined)
      setRoles(undefined)
    }
  }, [isRoleManager, multicall, setPrevious, setRoles])

  const permitted = useMemo(() => Boolean(roles && (roles & roleMask) === roleMask), [roles, roleMask])

  useEffect(() => setNext(previous ?? ''), [setNext, previous])

  const changed = useMemo(() => Boolean(((previous || next) && (previous !== next))), [previous, next])
  const [error, setError] = useState<string | undefined>(undefined)

  const { 
    simulation, write, confirmation, resolveToast
  } = useWrite(contract, next, isConnected && changed && isNextValid)

  useEffect(() => {
    if (confirmation.isSuccess) {
      setPrevious(EvmAddressSchema.parse(next))
      resolveToast()
    }
  }, [confirmation, setPrevious, next, resolveToast])

  const onChange = useCallback((next: string, isValid: boolean) => {
    setNext(next)
    setIsNextValid(isValid)
    setError(undefined)
    write.reset()
  }, [setNext, setIsNextValid, setError, write])

  useEffect(() => {
    if (simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(simulation.error.message)
    }
  }, [simulation, setError])

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

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
    <div className="text-neutral-400">{label}</div>
    <div className="flex items-center gap-4">
      <InputAddress 
        previous={previous}
        next={next}
        setNext={setNext}
        isNextValid={isNextValid}
        setIsNextValid={setIsNextValid}
        onChange={onChange} 
        theme={inputTheme} 
        disabled={disableInput} />
      <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="w-field-btn h-field-btn">{verb}</Button>
    </div>
  </div>
}
