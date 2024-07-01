import { useCallback, useEffect, useMemo, useState } from 'react'
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions, Transition } from '@headlessui/react'
import { InputClassName } from '@/components/elements/Input'
import { CheckIcon, ChevronDown, CircleAlert } from 'lucide-react'
import { EvmAddress, EvmAddressSchema } from '@/lib/types'

export function Combo({ 
  previous,
  next,
  setNext,
  isValid,
  setIsValid,
  options,
  disabled 
}: { 
  previous?: EvmAddress,
  next?: string,
  setNext: (next: string) => void,
  isValid: boolean,
  setIsValid: (isValid: boolean) => void,
  options: EvmAddress[],
  disabled: boolean 
}) {
  const [query, setQuery] = useState(previous ?? '')
  const [hasInput, setHasInput] = useState((previous?.length ?? 0) > 0)

  const filter = useMemo(() => {
    return options.filter((option) => {
      return option.toLowerCase().includes(query.toLowerCase())
    })
  }, [options, query])

  const onSelect = useCallback((value: EvmAddress | null) => {
    if (value) {
      setQuery(value)
      setNext(value)
      setHasInput(value.length > 0)
      setIsValid(EvmAddressSchema.safeParse(value).success)
    }
  }, [setNext, setIsValid])

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setQuery(value)
    setNext(value)
    setHasInput(value.length > 0)
    setIsValid(EvmAddressSchema.safeParse(value).success)
  }, [setNext, setIsValid])

  useEffect(() => {
    setIsValid(EvmAddressSchema.safeParse(query).success)
  }, [setIsValid, query])

  return <Combobox disabled={disabled} value={next ?? previous ?? ''} onChange={onSelect}>
    <div className="relative">
      <ComboboxInput
        placeholder="0x"
        maxLength={42}
        className={InputClassName}
        value={next ?? previous ?? ''}
        displayValue={(option: EvmAddress | null | undefined) => option ?? ''}
        onChange={handleInputChange}
      />
      <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
        <ChevronDown className="size-4 text-neutral-100" />
      </ComboboxButton>
      {hasInput && !isValid && (
        <div className="absolute top-0 right-8 h-full flex items-center">
          <CircleAlert className="size-4 text-yellow-400" />
        </div>
      )}
    </div>
    <ComboboxOptions
      anchor="bottom"
      className="w-[var(--input-width)] rounded-primary border border-secondary-400 border-t-0 bg-neutral-900 [--anchor-gap:var(--spacing-1)] empty:hidden"
    >
      {filter.map(option => (
        <ComboboxOption
          key={option}
          value={option}
          className="group flex cursor-default items-center gap-2 py-1.5 px-3 select-none data-[focus]:bg-white/10"
        >
          <CheckIcon className="invisible size-4 text-neutral-100 group-data-[selected]:visible" />
          <div className="text-sm/6 text-neutral-100 truncate">
            {option}
          </div>
        </ComboboxOption>
      ))}
    </ComboboxOptions>
  </Combobox>
}
