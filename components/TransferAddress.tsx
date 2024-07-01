'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '@/components/elements/Button'
import { UseSimulateContractParameters, useAccount, useReadContracts, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { getAddress, zeroAddress } from 'viem'
import InputAddress from '@/components/InputAddress'
import { EvmAddress, EvmAddressSchema, compareEvmAddresses } from '@/lib/types'
import { useWriteContract } from '@/hooks/useWriteContract'

function useWrite(
  address: EvmAddress,
  abi: any,
  functionName: string,
  args: any[],
  enabled: boolean
) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address, abi, functionName, args,
    query: { enabled }
  }), [address, abi, functionName, args, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export default function TransferAddress({
  contract,
  transferPermitted,
  refetchTransferPermitted,
  className
}: {
  contract: {
    address: EvmAddress,
    abi: any,
    current: string,
    propose: string,
    proposal: string,
    accept: string
  },
  transferPermitted: boolean,
  refetchTransferPermitted: () => void,
  className?: string 
}) {
  const { isConnected, address } = useAccount()
  const [previous, setPrevious] = useState<EvmAddress | undefined>(undefined)
  const [proposal, setProposal] = useState<EvmAddress | undefined>(undefined)
  const isProposed = useMemo(() => proposal === address, [proposal, address])
  const [next, setNext] = useState<string | undefined>(undefined)
  const [isNextValid, setIsNextValid] = useState<boolean>(false)

  const multicall = useReadContracts({ contracts: [
    { address: contract.address, abi: contract.abi, functionName: contract.current },
    { address: contract.address, abi: contract.abi, functionName: contract.proposal }
  ]})

  useEffect(() => {
    if (multicall.data?.every(d => d.status === 'success')) {
      const _previous = EvmAddressSchema.parse(multicall.data![0].result)
      const _proposal = EvmAddressSchema.parse(multicall.data![1].result)
      setPrevious(_proposal === zeroAddress ? _previous : _proposal)
      setProposal(_proposal === zeroAddress ? undefined : _proposal)
    } else {
      setPrevious(undefined)
      setProposal(undefined)
    }
  }, [multicall, setPrevious, setNext, setIsNextValid, setProposal])

  const [error, setError] = useState<string | undefined>(undefined)
  const changed = useMemo(() => Boolean(((previous && next) && !compareEvmAddresses(previous, next))), [previous, next])
  const accepting = useMemo(() => !!proposal && !(next && isNextValid && changed), [next, isNextValid, proposal, changed])
  const verb = useMemo(() => accepting ? 'Accept' : 'Transfer', [accepting])

  const propose = useWrite(
    contract.address,
    contract.abi,
    contract.propose,
    [getAddress(isNextValid ? next! : zeroAddress)],
    isConnected && changed && isNextValid
  )

  useEffect(() => {
    if (propose.confirmation.isSuccess) {
      setPrevious(EvmAddressSchema.parse(next))
      setProposal(EvmAddressSchema.parse(next))
      propose.resolveToast()
    }
  }, [propose, setPrevious, setProposal, next])

  useEffect(() => {
    if (propose.simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(propose.simulation.error.message)
    }
  }, [propose, setError])

  const accept = useWrite(
    contract.address,
    contract.abi,
    contract.accept,
    [],
    isProposed && accepting
  )

  useEffect(() => {
    if (accept.confirmation.isSuccess) {
      setProposal(undefined)
      accept.resolveToast()
      refetchTransferPermitted()
    }
  }, [accept, setProposal, refetchTransferPermitted])

  useEffect(() => {
    if (accept.simulation.isError) {
      setError(`This will revert, see console for details.`)
      console.error(accept.simulation.error.message)
    }
  }, [accept, setError])

  const onChange = useCallback((next: string, isValid: boolean) => {
    setNext(next)
    setIsNextValid(isValid)
    setError(undefined)
    propose.write.reset()
  }, [setNext, setIsNextValid, setError, propose])

  const inputTheme = useMemo(() => {
    if (multicall.isFetching) return 'sim'
    return 'default'
  }, [multicall])

  const disableInput = useMemo(() => 
    multicall.isFetching
    || !transferPermitted,
  [multicall, transferPermitted])

  const buttonTheme = useMemo(() => {
    if (propose.write.isSuccess && propose.confirmation.isPending) return 'confirm'
    if (propose.write.isPending) return 'write'
    if (propose.simulation.isFetching) return 'sim'

    if (accept.write.isSuccess && accept.confirmation.isPending) return 'confirm'
    if (accept.write.isPending) return 'write'
    if (accept.simulation.isFetching) return 'sim'

    return 'default'
  }, [propose, accept])

  const disableTransfer = useMemo(() => 
    !isNextValid 
    || !changed
    || propose.simulation.isFetching
    || !propose.simulation.isSuccess
    || propose.write.isPending
    || (propose.write.isSuccess && propose.confirmation.isPending),
  [isNextValid, changed, propose])

  const disableAccept = useMemo(() => 
    !accepting
    || !isProposed
    || accept.simulation.isFetching
    || !accept.simulation.isSuccess
    || accept.write.isPending
    || (accept.write.isSuccess && accept.confirmation.isPending),
  [accepting, isProposed, accept])

  const disableButton = useMemo(() => 
    accepting ? disableAccept : disableTransfer,
  [accepting, disableAccept, disableTransfer])

  const onClick = useCallback(() => {
    if (accepting) {
      accept.write.writeContract(accept.simulation.data!.request)
    } else {
      propose.write.writeContract(propose.simulation.data!.request)
    }
  }, [propose, accepting, accept])

  return <div className={`w-full flex flex-col gap-2 ${className}`}>
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
      <Button onClick={onClick} theme={buttonTheme} disabled={disableButton} className="w-field-btn h-field-btn">
        {verb}
      </Button>
    </div>
  </div>
}
