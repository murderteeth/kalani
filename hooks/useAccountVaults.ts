import { z } from 'zod'
import useSWR from 'swr'
import { AccountRoleSchema, EvmAddressSchema, compareEvmAddresses } from '@/lib/types'
import { useMemo } from 'react'
import { ROLES, PSEUDO_ROLES } from '@/lib/types'

function getRoles(permittedRolesMask: bigint): Record<string, boolean> {
  const roles: {
    [key: string]: boolean
  } = {}

  for (const role in ROLES) {
    if (isNaN(Number(role))) {
      const mask = ROLES[role as keyof typeof ROLES]
      roles[role] = (permittedRolesMask & mask) === mask
    }
  }

  return roles
}

export const VaultSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  asset: z.object({
    address: EvmAddressSchema,
    symbol: z.string(),
    name: z.string(),
    decimals: z.number()  
  }),
  strategies: EvmAddressSchema.array().default([]),
  tvl: z.preprocess(val => val ?? { close: 0 }, z.object({ close: z.number() })),
  apy: z.preprocess(val => val ?? { close: 0 }, z.object({ close: z.number() }))
})

export type Vault = z.infer<typeof VaultSchema>

export const StrategySchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  apiVersion: z.string(),
  name: z.string(),
  lastReport: z.number({ coerce: true }).nullish(),
  lastReportDetail: z.object({
    blockNumber: z.bigint({ coerce: true }),
    blockTime: z.string(),
    profit: z.bigint({ coerce: true }),
    profitUsd: z.number(),
    loss: z.bigint({ coerce: true }),
    lossUsd: z.number(),
    apr: z.object({
      gross: z.number(),
      net: z.number()
    })
  }).nullish()
})

export type Strategy = z.infer<typeof StrategySchema>

export const UserVaultSchema = VaultSchema.extend({
  roleMask: z.number({ coerce: true }),
  roles: z.record(z.string(), z.boolean()),
  roleManager: z.boolean(),
  strategies: StrategySchema.array().default([])
})

export type UserVault = z.infer<typeof UserVaultSchema>

export const UserSchema = z.object({
  address: EvmAddressSchema,
  vaults: UserVaultSchema.array()
})

export type User = z.infer<typeof UserSchema>

const QUERY = `
query Query($account: String!, $chainId: Int) {
  accountRoles(account: $account, chainId: $chainId) {
    chainId
    vault: address
    address: account
    roleMask
  }

  accountVaults(account: $account, chainId: $chainId) {
    chainId
    address
    name
    asset {
      address
      symbol
      name
      decimals
    }
    strategies
    tvl { close }
    apy { close: net }
  }

  accountStrategies(account: $account) {
    chainId
    address
    apiVersion
    name
    healthCheck
    lastReport
    lastReportDetail {
      blockNumber
      blockTime
      profit
      profitUsd
      loss
      lossUsd
      apr {
        gross
        net
      }
    }
  }
}
`

export function useAccountVaults(account?: `0x${string}` | null) {
  if(!account) return undefined

  const endpoint = process.env.NEXT_PUBLIC_KONG_GQL ?? 'http://localhost:3001/api/gql'

  const { data } = useSWR(
    `${endpoint}`, (...args) => fetch(...args, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { account }
      })
    }).then(res => res.json()).catch(reason => {
      console.error(reason)
      return {}
    }),
    { refreshInterval: parseInt(process.env.NEXT_PUBLIC_USEVAULTS_REFRESH || '10_000') }
  )

  const user: User = useMemo(() => {
    const roles = AccountRoleSchema.array().parse(data?.data?.accountRoles ?? [])
    const vaults = VaultSchema.array().parse(data?.data?.accountVaults ?? [])
    const strategies = StrategySchema.array().parse(data?.data?.accountStrategies ?? [])
    return UserSchema.parse({
      address: account,
      vaults: vaults.map(vault => {
        const roleMask = roles.find(role => compareEvmAddresses(role.vault, vault.address))?.roleMask ?? 0n
        return { 
          ...vault, 
          roleMask,
          roles: getRoles(roles.find(role => compareEvmAddresses(role.vault, vault.address))?.roleMask ?? 0n),
          roleManager: (PSEUDO_ROLES.ROLE_MANAGER & roleMask) === PSEUDO_ROLES.ROLE_MANAGER,
          strategies: strategies.filter(strategy => vault.strategies.includes(strategy.address))
        }
      })
    })
  }, [data])

  return user
}
