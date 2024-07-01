import { UseReadContractsReturnType } from 'wagmi'

export function greatSuccess(
  multicall: UseReadContractsReturnType
): multicall is UseReadContractsReturnType & { data: NonNullable<UseReadContractsReturnType['data']> } {
  return !!multicall.data?.every(d => d.status === 'success')
}
