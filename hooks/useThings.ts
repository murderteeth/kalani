import { z } from 'zod'
import useSWR from 'swr'
import { EvmAddressSchema } from '@/lib/types'

const ThingSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  label: z.string()
})

export type Thing = z.infer<typeof ThingSchema>

const QUERY = `
query Query($labels: [String]!) {
  things(labels: $labels) {
    chainId
    address
    label
  }
}
`

export function useThings() {
  const endpoint = process.env.NEXT_PUBLIC_KONG_GQL ?? 'http://localhost:3001/api/gql'

  const { data } = useSWR(
    `${endpoint}`, (...args) => fetch(...args, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { labels: ['vault', 'strategy', 'accountant'] }
      })
    }).then(res => res.json()).catch(reason => {
      console.error(reason)
      return {}
    })
  )

  return ThingSchema.array().parse(data?.data?.things ?? [])
}
