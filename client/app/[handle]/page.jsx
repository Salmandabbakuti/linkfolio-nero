import Profile from "./page.client";
import { linkFolioContract } from "@/app/utils";

export const revalidate = 60;
export async function generateMetadata({ params }) {
  const { handle } = await params;
  console.log("Generating metadata for handle:", handle);
  const profile = await linkFolioContract
    .getProfileByHandle(handle)
    .catch((err) =>
      console.error(
        `Failed to fetch profile for ${handle} in metadata generation:`,
        err
      )
    );

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
      images: image ? { url: image, width: 1200, height: 630, alt: handle } : {}
    },
    // Canonical URL (Prevents duplicate content issues)
    alternates: {
      canonical: url
    },
    robots: "index, follow"
  };
}

export default Profile;
