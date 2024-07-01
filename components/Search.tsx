'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Input from './elements/Input'
import { PiKeyReturnFill, PiWarningCircle } from 'react-icons/pi'
import useKeypress from 'react-use-keypress'
import { EvmAddressSchema } from '@/lib/types'
import { useAccount } from 'wagmi'

export default function Search({ onSearch, className }: { onSearch?: (q: string) => void, className?: string }) {
  const { isConnected, address } = useAccount()
  const ref = useRef<HTMLInputElement>(null)
  const [hasInput, setHasInput] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const onSlash = useCallback(() => setTimeout(() => ref.current?.focus(), 0), [ref])
  const onEnter = useCallback(() => { if (isValid) onSearch?.(ref.current?.value || '') }, [isValid, ref, onSearch])
  useKeypress('/', onSlash)
  useKeypress('Enter', onEnter)
  const showEnter = hasInput && isValid

  useEffect(() => {
    if (isConnected && address && ref.current && ref.current.value.length === 0) {
      ref.current.value = address!
      setHasInput(true)
      setIsValid(true)
    }
  }, [ref, isConnected, address, setHasInput, setIsValid])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setHasInput(e.target.value.length > 0)
    setIsValid(EvmAddressSchema.safeParse(e.target.value).success)
  }, [setHasInput, setIsValid])

  return <div className={`group relative ${className}`}>
    <Input ref={ref} type="text" onChange={onChange} maxLength={42} placeholder={'Search by address / vault / token'} className="w-full" />
    {!hasInput && <div className={`
      absolute top-0 right-4 h-full flex items-center text-neutral-800`}>/</div>}

    {hasInput && !isValid && <div className={`
      absolute top-0 right-4 h-full flex items-center text-yellow-400`}>
      <PiWarningCircle />
      </div>}

    {showEnter && <div onClick={onEnter} className={`
      absolute top-0 right-4 h-full flex items-center 
      text-white group-hover:text-violet-300 group-has-[:focus]:text-violet-400
      cursor-pointer`}>
      <PiKeyReturnFill />
    </div>}
  </div>
}
