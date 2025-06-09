
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Wallet, LogOut, CheckCircle } from 'lucide-react';

const generateMockAddress = (): string => {
  const prefix = '0x';
  const chars = '0123456789abcdef';
  let addressPart = '';
  for (let i = 0; i < 10; i++) { // Shorter for mock display
    addressPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${addressPart}`;
};

const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const ConnectWalletButton: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = () => {
    const newAddress = generateMockAddress();
    setWalletAddress(newAddress);
    setIsConnected(true);
    // In a real app, this would involve interacting with window.ethereum or other provider
    console.log(`Wallet connected (mock): ${newAddress}`);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    console.log('Wallet disconnected (mock)');
  };

  const handleClick = () => {
    if (isConnected) {
      handleDisconnect();
    } else {
      handleConnect();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={isConnected ? "secondary" : "primary"}
      size="md"
      className="transition-all duration-300 ease-in-out"
      title={isConnected ? "Disconnect wallet" : "Connect wallet"}
    >
      {isConnected && walletAddress ? (
        <>
          <CheckCircle size={18} className="mr-2 text-green-400" />
          <span className="font-mono text-sm">{truncateAddress(walletAddress)}</span>
          <LogOut size={18} className="ml-3 opacity-70 hover:opacity-100" />
        </>
      ) : (
        <>
          <Wallet size={18} className="mr-2" />
          Connect Wallet
        </>
      )}
    </Button>
  );
};
