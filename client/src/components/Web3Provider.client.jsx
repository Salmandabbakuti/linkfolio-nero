import { ConfigProvider, theme, App as AntdApp } from "antd";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { defineChain } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;

const neroTestnetChain = defineChain({
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
    default: { name: "Explorer", url: "https://testnet.neroscan.io" }
  }
});

const neroMainnetChain = defineChain({
  id: 1689,
  caipNetworkId: "eip155:1689",
  chainNamespace: "eip155",
  name: "Nero Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Nero",
    symbol: "NERO"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.nerochain.io"],
      webSocket: ["wss://rpc.nerochain.io"]
    }
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://neroscan.io" }
  }
});

const networks = [neroMainnetChain, neroTestnetChain];
const metadata = {
  name: "LinkFolio",
  description:
    "LinkFolio turns personal profiles into NFTs. Own your soulbound digital identity effortlessly fully onchain",
  url: "https://linkfolio-nero.vercel.app",
  icons: ["https://linkfolio-nero.vercel.app/favicon.ico"]
};

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks,
  projectId,
  defaultNetwork: neroMainnetChain,
  allowUnsupportedChain: false,
  chainImages: {
    689: "https://testnet.neroscan.io/favicon.svg",
    1689: "https://framerusercontent.com/images/45NncLY0V1ELrMis3GvSCJsN79s.png"
  },
  themeMode: "dark",
  features: {
    analytics: true,
    swaps: false,
    onramp: false,
    email: true,
    connectMethodsOrder: ["social", "email", "wallet"],
    emailShowWallets: true,
    legalCheckbox: true
  },
  termsConditionsUrl: "https://linkfolio-nero.vercel.app#terms",
  privacyPolicyUrl: "https://linkfolio-nero.vercel.app#privacy"
});

export default function Web3ProviderClient({ children }) {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366f1",
          colorText: "#e5e7eb",
          colorBgContainer: "rgba(255, 255, 255, 0.05)",
          colorBgElevated: "#293142",
          colorBorder: "rgba(124, 139, 255, 0.25)",
          borderRadius: 8,
          controlHeight: 32
        },
        components: {
          Layout: {
            headerBg: "transparent",
            footerBg: "transparent",
            bodyBg: "transparent"
          }
        }
      }}
    >
      <AntdApp>{children}</AntdApp>
    </ConfigProvider>
  );
}
