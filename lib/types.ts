import { getAddress } from 'viem'
import { z } from 'zod'

export type ThemeName = 'default' | 'disabled' | 'sim' | 'write' | 'confirm' | 'active' | 'secondary'

export const zevmaddressstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]{40}$/.test(val))
export const zvaultType = z.enum(['vault', 'strategy'])

export const EvmAddressSchema = zevmaddressstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>
export function compareEvmAddresses(a?: string, b?: string) {
  if (!a || !b) return false

  try {
    return EvmAddressSchema.parse(getAddress(a)) === EvmAddressSchema.parse(getAddress(b))
  } catch {
    return false
  }
}

export const ROLES = {
  ADD_STRATEGY_MANAGER: 2n ** 0n,
  REVOKE_STRATEGY_MANAGER: 2n ** 1n,
  FORCE_REVOKE_MANAGER: 2n ** 2n,
  ACCOUNTANT_MANAGER: 2n ** 3n,
  QUEUE_MANAGER: 2n ** 4n,
  REPORTING_MANAGER: 2n ** 5n,
  DEBT_MANAGER: 2n ** 6n,
  MAX_DEBT_MANAGER: 2n ** 7n,
  DEPOSIT_LIMIT_MANAGER: 2n ** 8n,
  WITHDRAW_LIMIT_MANAGER: 2n ** 9n,
  MINIMUM_IDLE_MANAGER: 2n ** 10n,
  PROFIT_UNLOCK_MANAGER: 2n ** 11n,
  DEBT_PURCHASER: 2n ** 12n,
  EMERGENCY_MANAGER: 2n ** 13n
}

export const PSEUDO_ROLES = {
  ROLE_MANAGER: 2n ** 255n
}

export function* enumerateEnum<T>(enumObj: T): Generator<keyof T> {
  for (const key in enumObj) {
    if (isNaN(Number(key))) {
      yield key as keyof T
    }
  }
}

export const AccountRoleSchema = z.object({
  chainId: z.number(),
  vault: EvmAddressSchema,
  address: EvmAddressSchema,
  roleMask: z.bigint({ coerce: true })
})

export type AccountRole = z.infer<typeof AccountRoleSchema>

export const IndexedItemSchema = z.object({
  label: z.enum(["vault", "strategy", "erc4626", "accountant"]),
  chainId: z.number(),
  address: z.string(),
  name: z.string().optional(),
  nameLower: z.string().optional(),
  strategies: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.array(z.string()).optional()
  ),
  token: z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string()
  }).optional(),
  tvl: z.number().optional(),
  addressIndex: z.string()
})

export type IndexedItem = z.infer<typeof IndexedItemSchema>
