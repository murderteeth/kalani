import { z } from 'zod'
import { EvmAddressSchema } from '@/lib/types'

export const TaggedAccountantSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  tags: z.array(z.string())
})

export type TaggedAccountant = z.infer<typeof TaggedAccountantSchema>

const json = [
  {
    "chainId": 1,
    "address": "0x1DA267586Adc3F772FE45D600d1487E636cC4fdE",
    "tags": ["yPRISMA-1"]
  },
  {
    "chainId": 1,
    "address": "0x1f399808fE52d0E960CAB84b6b54d5707ab27c8a",
    "tags": ["usdc", "dai", "weth"]
  },
  {
    "chainId": 1,
    "address": "0x4235599F79cf269dB68cDc1dE01C242459F6F318",
    "tags": ["Swell", "Redacted pxETH", "Sommelier", "GHO", "EtherFi", "Kelp"]
  },
  {
    "chainId": 1,
    "address": "0x5A74Cb32D36f2f517DB6f7b0A0591e09b22cDE69",
    "tags": ["DAI-1", "DAI-2", "USDC-1", "crvUSD-2", "usdc", "WETH-1", "WETH-2", "USDC-2"]
  },
  {
    "chainId": 1,
    "address": "0x9C7e7D0C1D8e17643Ad16717ff77cc522Eb0804f",
    "tags": ["Sturdy - crvUSD"]
  },
  {
    "chainId": 1,
    "address": "0xEC49bA7D641618a0C7E5507a77663061052d4a55",
    "tags": ["Yearn-Ajna DAI", "Yearn-Ajna WETH"]
  },
  {
    "chainId": 100,
    "address": "0xd84e84F018b9c8cC7d9f898a544D1D18080BfD21",
    "tags": ["EURe"]
  },
  {
    "chainId": 100,
    "address": "0xdb0Fd022BA9d52d8c90BC69a22E24c4d3f895D11",
    "tags": ["Curve EURe"]
  },
  {
    "chainId": 100,
    "address": "0xf7EC5D01F5b5ACDae518CE69ff5F2599e4D705bE",
    "tags": ["AJNA EURe"]
  },
  {
    "chainId": 137,
    "address": "0x02A44309d41C70Df9745Ca05ADdabd7a9a9EA67e",
    "tags": ["Yearn-Ajna USDC"]
  },
  {
    "chainId": 137,
    "address": "0x54483f1592ab0aDea2757Ae0d62e6393361d4CEe",
    "tags": ["USDC-1", "DAI", "USDC", "WETH", "USDT", "WMATIC"]
  },
  {
    "chainId": 42161,
    "address": "0x9aB47bE62631036CDa3a64B8322704988427F366",
    "tags": ["USDC-A", "USDT-A"]
  }
] as const

export default TaggedAccountantSchema.array().parse(json)
