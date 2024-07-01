'use client'

import GlowGroup from '@/components/elements/GlowGroup'
import Input from '@/components/elements/Input'
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import useKeypress from 'react-use-keypress'
import { fEvmAddress } from '@/lib/format'
import { isNothing } from '@/lib/strings'
import { IndexedItem } from '@/lib/types'
import { ScrollArea } from '@/components/shadcn/scroll-area'
import { useRouter } from 'next/navigation'
import { useIndexedItems } from '@/hooks/useIndexedItems'

const MAX_ITEMS = 100

interface FinderProps {
  placeholder?: string,
  className?: string
  inputClassName?: string
}

const Finder: React.FC<FinderProps> = ({ placeholder, className, inputClassName }) => {
  const router = useRouter()

  const onFind = useCallback((item: IndexedItem) => {
    return router.push(`/${item.label}/${item.chainId}/${item.address}`)
  }, [router])

  const items = useIndexedItems()

  const [inputValue, setInputValue] = useState('')
  const [filteredItems, setFilteredItems] = useState<IndexedItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const onSlash = useCallback(() => setTimeout(() => inputRef.current?.focus(), 0), [inputRef])
  useKeypress('/', onSlash)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (inputRef.current != null && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (items.length > 0) {
      setFilteredItems(items.slice(0, MAX_ITEMS))
    }
  }, [items])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setInputValue(value)
    filterItems(value)
  }

  const filterItems = (value: string): void => {
    const valueLower = value.toLowerCase()
    const filtered = items.filter((item: IndexedItem) =>
      item.nameLower?.includes(valueLower)
      || item.addressIndex.toLowerCase().includes(valueLower)
    )

    filtered.sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))

    setFilteredItems(filtered.slice(0, MAX_ITEMS))
    setSelectedIndex(-1)
  }

  const handleItemClick = (item: IndexedItem): void => {
    setInputValue(item.name ?? item.label)
    onFind?.(item)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleItemClick(filteredItems[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleFocus = (): void => {
    setShowSuggestions(true)
    if (inputValue === '') {
      setFilteredItems(items.slice(0, MAX_ITEMS))
    }
  }

  return <div className={`relative ${className}`}>
    <Input
      ref={inputRef}
      type="text"
      value={inputValue}
      placeholder={placeholder}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={inputClassName}
    />

    <div className={`
      absolute top-0 right-4 h-full flex items-center text-neutral-800`}>/
    </div>

    {showSuggestions && filteredItems.length > 0 && (
      <GlowGroup className="absolute w-full mt-3">
        <ScrollArea className="w-full max-h-80 overflow-auto bg-neutral-950 border border-secondary-400 rounded-primary">
          <table className="table-fixed w-full text-neutral-200">
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={`${index}-${item.address}`}
                  onClick={() => handleItemClick(item)}
                  onMouseOver={() => setSelectedIndex(index)}
                  className={`
                    cursor-pointer
                    hover:bg-black hover:text-secondary-400
                    ${index === selectedIndex ? 'bg-black text-secondary-400' : ''}
                    ${index === 0 ? 'rounded-t-primary' : ''}
                    ${index === filteredItems.length - 1 ? 'rounded-b-primary' : ''}
                  `}
                >
                  <td className="w-20 px-4 py-4 text-xs text-center">{item.chainId}</td>
                  <td className="w-20 py-4 text-xs">{item.label}</td>
                  <td className="w-36 py-4">{fEvmAddress(item.address)}</td>
                  <td className="max-w-0 px-4 py-4 truncate">
                    {isNothing(item.name) ? item.label : item.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </GlowGroup>
    )}
  </div>
}

export default Finder
