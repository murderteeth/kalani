import { IndexedItem, IndexedItemSchema } from '@/lib/types'
import { NextResponse } from 'next/server'

const QUERY = `
query Query {
  accountants {
    chainId
    address
    vaults
  }
  vaults(apiVersion: "3") {
    chainId
    address
    name
    strategies
    yearn
    erc4626
    apiVersion
    asset {
      address
      name
      symbol
      decimals
    }
    tvl {
      close
    }
  }
  strategies(apiVersion: "3") {
    chainId
    address
  }
}
`

function isIterable(obj: any): boolean {
  // Check if the object is not null and has a Symbol.iterator method
  return obj != null && typeof obj[Symbol.iterator] === 'function'
}

function toIndexedItems(gqlResult: any): IndexedItem[] {
  const items: IndexedItem[] = []

  // Create a set of strategy addresses for quick lookup
  const strategyAddresses = new Set(gqlResult.data.strategies.map((s: any) => s.address.toLowerCase()))

  // Process vaults
  gqlResult.data.vaults.forEach((vault: any) => {
    const item: IndexedItem = {
      label: vault.yearn 
      ? strategyAddresses.has(vault.address.toLowerCase()) ? 'strategy' : 'vault'
      : 'erc4626',
      chainId: parseInt(vault.chainId),
      address: vault.address,
      name: vault.name,
      nameLower: vault.name.toLowerCase(),
      strategies: vault.strategies,
      token: {
        address: vault.asset.address,
        name: vault.asset.name,
        symbol: vault.asset.symbol
      },
      tvl: vault.tvl?.close,
      addressIndex: [vault.address, ...(vault.strategies ?? []), vault.asset.address].join(' ').toLowerCase()
    }
    items.push(item)

    // Process strategies associated with this vault
    vault.strategies?.forEach((strategyAddress: string) => {
      if (strategyAddresses.has(strategyAddress.toLowerCase())) {
        const strategyItem: IndexedItem = {
          label: 'strategy',
          chainId: parseInt(vault.chainId),
          address: strategyAddress,
          name: `${vault.name} Strategy`,
          nameLower: `${vault.name} Strategy`.toLowerCase(),
          token: {
            address: vault.asset.address,
            name: vault.asset.name,
            symbol: vault.asset.symbol
          },
          addressIndex: `${strategyAddress} ${vault.asset.address}`.toLowerCase()
        }
        items.push(strategyItem)
      }
    })
  })

  // Process accountants
  gqlResult.data.accountants.forEach((accountant: any) => {
    const item: IndexedItem = {
      label: 'accountant',
      chainId: parseInt(accountant.chainId),
      address: accountant.address,
      addressIndex: accountant.address.toLowerCase()
    }
    items.push(item)
  })

  const result = IndexedItemSchema.array().parse(items)
  result.sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
  return result
}

export async function GET() {
  const endpoint = process.env.NEXT_PUBLIC_KONG_GQL ?? 'http://localhost:3001/api/gql'

  const result = await fetch(endpoint, {
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

  return NextResponse.json(toIndexedItems(result))
}
