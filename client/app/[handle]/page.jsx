import Profile from "./page.client";
import { linkFolioContract } from "@/app/utils";

export const revalidate = 60;
export async function generateMetadata({ params }) {
  const { handle } = await params;
  console.log("Generating metadata for handle:", handle);
  try {
    const handleTokenId = await linkFolioContract.handleToTokenId(handle);
    console.log("Token ID for handle:", handleTokenId);
    const profile = await linkFolioContract.profiles(handleTokenId);
    console.log("Profile data:", profile);
    const title = profile?.name || handle;
    const description =
      profile?.bio ||
      "Create and own your digital identity as a soulbound NFT with on-chain metadata, gas-free via NERO Chain’s Paymaster and account abstraction.";
    const url = `https://linkfolio-nero.vercel.app/${handle}`;
    const image = profile?.avatar;
    const siteName = "LinkFolio";

    return {
      title,
      description,
      category: "technology",
      openGraph: {
        title: `${title} | LinkFolio`,
        description,
        type: "profile",
        url,
        siteName,
        images: image
          ? [{ url: image, width: 1200, height: 630, alt: handle }]
          : []
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | LinkFolio`,
        description,
        images: image
          ? { url: image, width: 1200, height: 630, alt: handle }
          : {}
      },
      // Canonical URL (Prevents duplicate content issues)
      alternates: {
        canonical: url
      },
      robots: "index, follow"
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
  }
}

export default Profile;
