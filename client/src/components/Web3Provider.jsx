import { ClientOnly } from "@tanstack/react-router";
import Web3ProviderClient from "./Web3Provider.client";

export default function Web3Provider({ children }) {
  return (
    <ClientOnly fallback={null}>
      <Web3ProviderClient>{children}</Web3ProviderClient>
    </ClientOnly>
  );
}
