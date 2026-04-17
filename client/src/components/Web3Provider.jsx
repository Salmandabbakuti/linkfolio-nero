import { useState, useEffect } from "react";
import { ConfigProvider, theme, App as AntdApp } from "antd";
import { createAppKit } from "@reown/appkit/react";
import { EthersAdapter } from "@reown/appkit-adapter-ethers";
import { neroTestnetChain, neroMainnetChain } from "@/utils";

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID;
const networks = [neroMainnetChain, neroTestnetChain];
const metadata = {
  name: "LinkFolio",
  description:
    "LinkFolio turns personal profiles into NFTs. Own your soulbound digital identity effortlessly fully onchain",
  url: "https://linkfolio-nero.vercel.app", // origin must match your domain & subdomain
  icons: ["https://linkfolio-nero.vercel.app/favicon.ico"]
};

createAppKit({
  adapters: [new EthersAdapter()],
  metadata,
  networks,
  projectId,
  defaultNetwork: neroMainnetChain, // Default network to use
  allowUnsupportedChain: false,
  chainImages: {
    689: "https://testnet.neroscan.io/favicon.svg",
    1689: "https://framerusercontent.com/images/45NncLY0V1ELrMis3GvSCJsN79s.png"
  },
  themeMode: "dark",
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    swaps: false,
    onramp: false,
    // send: false,
    // receive: false,
    // socials: false, // should be false or provider only
    email: true,
    connectMethodsOrder: ["social", "email", "wallet"],
    emailShowWallets: true,
    legalCheckbox: true
  },
  termsConditionsUrl: "https://linkfolio-nero.vercel.app#terms",
  privacyPolicyUrl: "https://linkfolio-nero.vercel.app#privacy"
});

export default function Web3Provider({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: "#6366f1", // Primary indigo
          colorText: "#e5e7eb", // Light gray for text
          colorBgContainer: "rgba(255, 255, 255, 0.05)", // Card backgrounds
          colorBgElevated: "#293142", // Modal, dropdown backgrounds
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
      <AntdApp>{mounted && children}</AntdApp>
    </ConfigProvider>
  );
}
