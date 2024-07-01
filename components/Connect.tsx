'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Button from './elements/Button'
import Image from 'next/image'

export default function Connect({ className }: { className?: string }) {
  return <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');
        return (() => {
          if (!connected) {
            return <Button 
              onClick={openConnectModal} 
              type="button" 
              h="secondary"
              className={`border-transparent ${className}`}>
              Connect
            </Button>
          }
          if (chain.unsupported) {
            return (
              <Button h="secondary" onClick={openChainModal} type="button">
                Wrong network
              </Button>
            );
          }
          return (
            <div className="flex items-center gap-4">
              <Button
                onClick={openChainModal}
                h="secondary"
                type="button"
                className={`border-transparent ${className}`}
              >
                {chain.hasIcon && (
                  <div
                    style={{
                      background: chain.iconBackground,
                      width: 12,
                      height: 12,
                      borderRadius: 999,
                      overflow: 'hidden',
                      marginRight: 4,
                    }}
                  >
                    {chain.iconUrl && (
                      <Image
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        width={12}
                        height={12}
                      />
                    )}
                  </div>
                )}
                {chain.name}
              </Button>
              <Button 
                className={`border-transparent ${className}`} 
                h="secondary" 
                onClick={openAccountModal} 
                type="button">
                {account.displayName}
                {account.displayBalance
                  ? ` (${account.displayBalance})`
                  : ''}
              </Button>
            </div>
          );
        })()
      }}
    </ConnectButton.Custom>
}