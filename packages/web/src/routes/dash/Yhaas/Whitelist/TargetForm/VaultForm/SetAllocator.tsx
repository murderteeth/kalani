import { useCallback, useEffect, useMemo, useState } from 'react'
import Address from '../../../../../../components/elements/Address'
import StepLabel from '../../StepLabel'
import { Switch } from '../../../../../../components/shadcn/switch'
import { Label } from '../../../../../../components/shadcn/label'
import Dialog, { DialogButton, useDialog } from '../../../../../../components/Dialog'
import Button from '../../../../../../components/elements/Button'
import { useWhitelist } from '../../provider'
import { fEvmAddress } from '@kalani/lib/format'
import { cn } from '../../../../../../lib/shadcn'
import Input from '../../../../../../components/elements/Input'
import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress } from '@kalani/lib/types'
import abis from '@kalani/lib/abis'
import { useWriteContract } from '../../../../../../hooks/useWriteContract'
import { toEventSelector, zeroAddress } from 'viem'
import { numberOr } from '@kalani/lib/nums'

const NewDebtAllocator = toEventSelector(
  'event NewDebtAllocator(address indexed allocator, address indexed vault)'
)

function useWrite(args: {
  vault: EvmAddress,
  governance: EvmAddress,
  minimumChange: bigint,
  enabled: boolean
}) {
  const { vault, governance, minimumChange, enabled } = args

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    address: '0x0D1F62247035BBFf16742B0f31e8e2Af3aCd6e67', 
    abi: abis.allocatorFactory, functionName: 'newGenericDebtAllocator',
    args: [vault, governance, minimumChange],
    query: { enabled }
  }), [vault, governance, minimumChange, enabled])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function MinChangeInput({
  disabled, 
  min, 
  onChange, 
  className
}: {
  disabled?: boolean,
  min?: number | undefined,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  className?: string
}) {
  const { chain } = useAccount()
  const symbol = chain?.nativeCurrency?.symbol ?? 'ETH'
  return <div className="relative">
    <Input
      disabled={disabled}
      value={isNaN(min ?? 0) ? '' : min ?? ''} 
      type="number"
      onChange={onChange}
      className={className}
      step="0.05"
      />
    <div className={cn(`
      absolute inset-0 pr-14
      flex items-center justify-end
      text-neutral-600 text-2xl
      pointer-events-none`)}>
      {symbol}
    </div>
  </div>
}

function CreateAllocatorButton() {
  return <DialogButton h="secondary" dialogId="create-allocator" className="w-field-btn h-field-btn text-sm flex flex-col whitespace-normal">
    Create allocator
  </DialogButton>
}

function CreateAllocatorDialog({ 
  vault,
  onNewAllocator
}: { 
  vault: EvmAddress, 
  onNewAllocator: (allocator: EvmAddress) => void
}) {
  const { closeDialog } = useDialog('create-allocator')
  const [minChange, setMinChange] = useState<number>(0)
  const minimumChange = useMemo<bigint>(() => BigInt(numberOr(minChange) * 10 ** 18), [minChange])
  const { isConnected, address: governance } = useAccount()

  const { simulation, write, confirmation, resolveToast } = useWrite({
    vault, 
    governance: governance ?? zeroAddress, 
    minimumChange, 
    enabled: isConnected 
  })

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const execText = useMemo(() => {
    if (simulation.isError) return 'Error'
    return 'Exec'
  }, [simulation])

  const execTooltip = useMemo(() => {
    if (simulation.isError) return simulation.error.stack
    return 'Create new onchain debt allocator'
  }, [simulation])

  const disabled = useMemo(() => 
    simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending),
  [simulation, write, confirmation])

  const onExec = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      const log = confirmation.data.logs.find(log => log.topics[0] === NewDebtAllocator)!
      const allocator = '0x' + log.topics[1]!.slice(-40) as `0x${string}`
      write.reset()
      onNewAllocator(allocator)
      resolveToast()
      closeDialog()
    }
  }, [confirmation, write, onNewAllocator, resolveToast, closeDialog])

  return <Dialog title="Create debt allocator" dialogId="create-allocator">
    <div className="flex flex-col gap-6">
      <div className="text-xl">
        For vault {fEvmAddress(vault)}
      </div>
      <div className="flex items-center gap-8">
        <div className="text-xl whitespace-nowrap">
          Min change
        </div>
        <MinChangeInput disabled={write.isPending} min={minChange} onChange={e => setMinChange(parseFloat(e.target.value))} />
      </div>
      <div className="text-neutral-600 text-sm">
        The minimum amount needed to trigger debt updates.
      </div>
    </div>
    <div className="flex items-center justify-end gap-4">
      <Button h="secondary" onClick={closeDialog}>Cancel</Button>
      <Button h="primary" theme={buttonTheme} onClick={onExec} disabled={disabled} title={execTooltip}>{execText}</Button>
    </div>
  </Dialog>
}

export default function SetAllocator() {
  const [allocator, setAllocator] = useState<string | undefined>(undefined)
  const [isValid, setIsValid] = useState<boolean>(false)
  const [automate, setAutomate] = useState<boolean>(false)
  const { targets } = useWhitelist()
  const vault = targets[0]

  const onNewAllocator = useCallback((allocator: EvmAddress) => {
    setAllocator(allocator)
    setIsValid(true)
    setAutomate(true)
  }, [setAllocator, setIsValid, setAutomate])

  return <div className="flex items-start gap-12">
    <StepLabel step={4} />
    <div className="grow flex flex-col gap-6">
      <p className="text-xl">Automate debt allocation (optional)</p>
      <div className="w-full flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Address
            previous={undefined} 
            next={allocator}
            isNextValid={isValid} 
            setIsNextValid={setIsValid} 
            frozen={true}
          />
          <CreateAllocatorButton />
          <CreateAllocatorDialog vault={vault} onNewAllocator={onNewAllocator} />
        </div>
        <div>
          <span className="group mx-6 inline-flex items-center gap-4">
            <Switch disabled={!isValid} id="automate-allocator" checked={automate} onCheckedChange={setAutomate} />
            <Label htmlFor="automate-allocator">Automate debt allocation</Label>
          </span>
        </div>
      </div>
    </div>
  </div>
}
