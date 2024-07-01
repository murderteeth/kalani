import { useMemo } from 'react'
import { IndexedItemSchema } from '@/lib/types'
import { useQuery } from '@tanstack/react-query'

export function useIndexedItems() {
  const { data } = useQuery({
    queryKey: ['index'],
    queryFn: () => fetch('/api/index').then((res) => res.json())
  })

  return useMemo(() => IndexedItemSchema.array().parse(data ?? []), [data])
}
