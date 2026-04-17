import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts
} from "@tanstack/react-router";
import Web3Provider from "@/components/Web3Provider";
import SiteLayout from "@/components/SiteLayout";
import appCss from "@/styles/globals.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "LinkFolio" },
      {
        name: "description",
        content:
          "Create and own your digital identity as a soulbound NFT with on-chain metadata, gas-free via NERO Chain’s Paymaster and account abstraction."
      },
      {
        name: "keywords",
        content: "LinkFolio, profiles, social media, blockchain, portfolio"
      }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" }
    ]
  }),
  component: RootLayout
});

function RootLayout() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Web3Provider>
          <SiteLayout>
            <Outlet />
          </SiteLayout>
        </Web3Provider>
        <Scripts />
      </body>
    </html>
  );
}
