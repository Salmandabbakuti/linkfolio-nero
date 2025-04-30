"use client";
import { useState, useEffect } from "react";
import { ConfigProvider, theme } from "antd";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { mainnet, arbitrum, defineChain } from "@reown/appkit/networks";

// Define the Nero Testnet chain
const neroTestnet = defineChain({
  id: 689,
  caipNetworkId: "eip155:689",
  chainNamespace: "eip155",
  name: "Nero Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Nero",
    symbol: "NERO"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-testnet.nerochain.io"],
      webSocket: ["wss://rpc-testnet.nerochain.io"]
    }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://testnet.neroscan.io/" }
  }
});

// 1. Get projectId at https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;
const networks = [mainnet, arbitrum, neroTestnet];

// 2. Create a metadata object
const metadata = {
  name: "LinkFolio",
  description:
    "LinkFolio turns personal profiles into NFTs. Own your soulbound digital identity effortlessly fully onchain",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"]
};

// 3. Create the AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks,
  projectId,
  defaultNetwork: neroTestnet,
  allowUnsupportedChain: false,
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#1677ff"
  },
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    swaps: false,
    onramp: false,
    // socials: false, // should be false or provider only
    email: true,
    connectMethodsOrder: ["wallet", "social", "email"],
    emailShowWallets: true,
    legalCheckbox: true,
    termsConditionsUrl: "https://example.com/terms",
    privacyPolicyUrl: "https://example.com/privacy"
  }
});

export default function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.defaultAlgorithm]
      }}
    >
      {mounted && children}
    </ConfigProvider>
  );
}
