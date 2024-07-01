import { useCallback, useEffect, useRef, useState } from 'react'
import Input from './elements/Input'
import { EvmAddress, EvmAddressSchema, ThemeName } from '@/lib/types'
import { PiWarningCircle } from 'react-icons/pi'

export default function InputAddress({ 
  placeholder,
  disabled,
  onChange,
  previous,
  next,
  setNext,
  isNextValid,
  setIsNextValid,
  theme,
  className
}: { 
  placeholder?: string,
  disabled?: boolean,
  onChange?: (next: string, isValid: boolean) => void,
  previous?: EvmAddress,
  next?: string,
  setNext: (next: string) => void,
  isNextValid: boolean,
  setIsNextValid: (isValid: boolean) => void,
  theme?: ThemeName,
  className?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [hasNext, setHasNext] = useState(false)

  const _onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasNext(e.target.value.length > 0)
    setNext(e.target.value)
    setIsNextValid(EvmAddressSchema.safeParse(e.target.value).success)
    onChange?.(e.target.value, EvmAddressSchema.safeParse(e.target.value).success)
  }, [setHasNext, setNext, setIsNextValid, onChange])

  useEffect(() => setIsNextValid?.(EvmAddressSchema.safeParse(next).success), [setIsNextValid, next])

  return <div className={`grow group relative rounded-primary ${className}`}>
    <Input
      ref={ref}
      type="text"
      value={next ?? previous ?? ''}
      onChange={_onChange}
      placeholder={placeholder ?? '0x'}
      disabled={disabled ?? false}
      theme={theme}
      maxLength={42}
      className="w-full text-base" />
    {hasNext && !isNextValid && <div className={`
      absolute top-0 right-4 h-full flex items-center text-yellow-400`}>
      <PiWarningCircle />
    </div>}
  </div>
}
