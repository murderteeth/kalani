import FieldLabelPair from '@/components/FieldLabelPair'
import Section from '@/components/Section'
import Button from '@/components/elements/Button'
import Input from '@/components/elements/Input'
import { Strategy, Vault } from '@/hooks/useVault'
import abis from '@/lib/abis'
import { greatSuccess } from '@/lib/multicall'
import { isNothing } from '@/lib/strings'
import { EvmAddress } from '@/lib/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useReadContracts } from 'wagmi'

const FIELDS = {
  managementFee: 0,
  performanceFee: 1,
  refundRatio: 2,
  maxFee: 3,
  maxGain: 4,
  maxLoss: 5
}

function FeeInput({
  name, value, onChange
}: {
  name: string,
  value: number | string | undefined,
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  const onKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '.' || event.key === ',') {
      event.preventDefault()
    }
  }, [])

  return <Input 
    name={name} 
    value={value ?? ''} 
    type="number"
    onChange={onChange}
    onKeyDown={onKeyDown}
    />
}

function FeesPerStrategy({
  accountant, vault, strategy
}: {
  accountant: EvmAddress,
  vault: Vault,
  strategy: Strategy
}) {
  const [isCustomConfig, setIsCustomConfig] = useState<boolean>(false)
  const [previous, setPrevious] = useState<readonly [number, number, number, number, number, number]>([0, 0, 0, 0, 0, 0])
  const [next, setNext] = useState<readonly [number, number, number, number, number, number]>([0, 0, 0, 0, 0, 0])
  const changed = useMemo(() => previous !== next, [previous, next])

  const multicall = useReadContracts({ contracts: [
    { address: accountant, abi: abis.accountant, functionName: 'defaultConfig' },
    { address: accountant, abi: abis.accountant, functionName: 'customConfig', args: [vault.address, strategy.address] },
    { address: accountant, abi: abis.accountant, functionName: 'useCustomConfig', args: [vault.address, strategy.address] }
  ] })

  useEffect(() => {
    if (greatSuccess(multicall)) {
      const [defaultConfig, customConfig, useCustomConfig] = multicall.data
      const config = (!!useCustomConfig.result ? customConfig.result! : defaultConfig.result!)
      setIsCustomConfig(!!useCustomConfig.result)
      setPrevious(config)
    }
  }, [multicall])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const asInt = isNothing(value) ? undefined : parseInt(value)
    setPrevious(prev => {
      const next = [...prev]
      next[parseInt(name)] = asInt ?? 0
      return next as unknown as readonly [number, number, number, number, number, number]
    })
  }, [])

  return <Section className="flex flex-col gap-12">
    <h2>{isCustomConfig ? 'Custom' : 'Default'} Fees, {strategy.name}</h2>
    <div className="grid grid-cols-3 gap-12">
      <FieldLabelPair label="Management Fee">
        <FeeInput name={String(FIELDS.managementFee)} value={previous[FIELDS.managementFee] ?? ''} onChange={onChange} />
      </FieldLabelPair>

      <FieldLabelPair label="Performance Fee">
        <FeeInput name={String(FIELDS.performanceFee)} value={previous[FIELDS.performanceFee] ?? ''} onChange={onChange} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Fee">
        <FeeInput name={String(FIELDS.maxFee)} value={previous[FIELDS.maxFee] ?? ''} onChange={onChange} />
      </FieldLabelPair>

      <FieldLabelPair label="Refund Ratio">
        <FeeInput name={String(FIELDS.refundRatio)} value={previous[FIELDS.refundRatio] ?? ''} onChange={onChange} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Gain">
        <FeeInput name={String(FIELDS.maxGain)} value={previous[FIELDS.maxGain] ?? ''} onChange={onChange} />
      </FieldLabelPair>

      <FieldLabelPair label="Max Loss">
        <FeeInput name={String(FIELDS.maxLoss)} value={previous[FIELDS.maxLoss] ?? ''} onChange={onChange} />
      </FieldLabelPair>
    </div>
    <div className="pt-8 flex justify-end gap-6">
      <Button className="h-field-btn" h={'secondary'}>Remove custom config</Button>
      <Button className="h-field-btn" h={'secondary'}>Update default config</Button>
      <Button className="h-field-btn">Create custom config</Button>
    </div>
  </Section>
}

export default function Fees({
  vault,
  accountant
}: {
  vault: Vault,
  accountant: EvmAddress
}) {
  return <div className="flex flex-col gap-8">
    {vault.strategies.map((strategy, i) => (
      <FeesPerStrategy
        key={i}
        accountant={accountant}
        vault={vault}
        strategy={strategy}
      />
    ))}
  </div>
}
