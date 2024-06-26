import { z } from 'zod'
import { useVaultFromParams } from '@/hooks/useVault'
import TransferRoleManager from '../TransferRoleManager'
import Button from '@/components/elements/Button'
import { PiPlus } from 'react-icons/pi'
import { useIsRoleManager } from '@/hooks/useRoleManager'
import SetRoles from '../SetRoles'
import { useCallback, useMemo, useState } from 'react'
import { EvmAddressSchema } from '@/lib/types'

const AccountRoleItemSchema = z.object({
  chainId: z.number(),
  vault: EvmAddressSchema,
  address: EvmAddressSchema.optional(),
  roleMask: z.bigint({ coerce: true }),
  editAddress: z.boolean()
})

type AccountRoleItem = z.infer<typeof AccountRoleItemSchema>

export default function Roles() {
  const [newAccounts, setNewAccounts] = useState<AccountRoleItem[]>([])
  const vault = useVaultFromParams()
  const isRoleManager = useIsRoleManager(vault?.address)

  const accounts = useMemo<AccountRoleItem[]>(() => {
    const previousAccounts = AccountRoleItemSchema.array().parse(
      vault?.accounts.map(account => ({ ...account, editAddress: false })) ?? []
    )
    return [...previousAccounts, ...newAccounts]
  }, [vault, newAccounts])

  const addAccount = useCallback(() => {
    if (vault) {
      setNewAccounts(current => [...current, {
        chainId: vault.chainId,
        vault: vault.address,
        address: undefined,
        roleMask: 0n,
        editAddress: true
      }])
    }
  }, [vault, setNewAccounts])

  if (!vault) return <></>

  return <div className="flex flex-col gap-8">
    <div>
      {accounts.map(account => <SetRoles 
        key={account.address} 
        vault={account.vault} 
        account={account.address}
        editAddress={account.editAddress}
      />)}
    </div>
    <div className="flex justify-end">
      <Button onClick={addAccount} disabled={!isRoleManager}><PiPlus /></Button>
    </div>
    <div className="p-8 border border-neutral-900 rounded-primary">
      <TransferRoleManager vault={vault.address} />
    </div>
  </div>
}
