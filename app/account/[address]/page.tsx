'use client'

import { EvmAddressSchema } from '@/lib/types'
import { useParams } from 'next/navigation'
import Account from './Account'

export default function Page() {
  const params = useParams()
  const account = EvmAddressSchema.parse(params.address)

  if (!account) return <></>

  return Account({ address: account })
}
