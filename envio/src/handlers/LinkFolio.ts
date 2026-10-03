/*
 * Please refer to https://docs.envio.dev for a thorough guide on all Envio indexer features
 */
import { indexer } from "envio";
import type { Profile, Note, Post } from "envio";

const CATEGORIES = ["Personal", "Creator", "Business"] as const;

function getCategory(category: bigint): (typeof CATEGORIES)[number] {
  const value = CATEGORIES[Number(category)] ?? "Personal";
  return value;
}

indexer.onEvent(
  { contract: "LinkFolio", event: "ProfileCreated" },
  async ({ event, context }) => {
    const {
      handle,
      tokenId,
      owner,
      eoa,
      name,
      category,
      bio,
      avatar,
      linkKeys,
      links,
      settingsHash
    } = event.params;
    const blockTimestamp = event.block.timestamp;

    // create user if not exists with eoa as id
    await context.User.getOrCreate({
      id: eoa,
      address: eoa,
      scw: owner,
      createdAt: blockTimestamp
    });

    const categoryString = getCategory(category);

    // Create a new Profile entity and store it in the context
    const entity: Profile = {
      id: handle,
      tokenId,
      name,
      handle,
      category: categoryString,
      bio,
      avatar,
      owner,
      eoa_id: eoa,
      linkKeys,
      links,
      tipAmount: 0n, // Initialize tipAmount to 0
      settingsHash,
      createdAt: blockTimestamp,
      updatedAt: blockTimestamp
    };

    context.Profile.set(entity);
  }
);

indexer.onEvent(
  { contract: "LinkFolio", event: "ProfileDeleted" },
  async ({ event, context }) => {
    const profileId = event.params.handle;
    const profile = await context.Profile.get(profileId);
    if (!profile) {
      context.log.warn(
        `[ProfileDeleted] Skipped: Profile with id "${profileId}" not exists.`
      );
      return;
    }
    context.Profile.deleteUnsafe(profileId);
  }
);

indexer.onEvent(
  { contract: "LinkFolio", event: "ProfileUpdated" },
  async ({ event, context }) => {
    const {
      handle,
      tokenId,
      owner,
      name,
      category,
      bio,
      avatar,
      linkKeys,
      links,
      settingsHash
    } = event.params;
    const blockTimestamp = event.block.timestamp;
    const categoryString = getCategory(category);

    const profile = await context.Profile.get(handle);

    const updatedProfile: Profile = {
      ...(profile ?? {
        id: handle,
        tokenId,
        handle,
        owner,
        eoa_id: owner,
        tipAmount: 0n,
        createdAt: blockTimestamp
      }),
      name,
      category: categoryString,
      bio,
      avatar,
      linkKeys,
      links,
      settingsHash,
      updatedAt: blockTimestamp
    };

    context.Profile.set(updatedProfile);
  }
);

indexer.onEvent(
  { contract: "LinkFolio", event: "NoteLeft" },
  async ({ event, context }) => {
    const { handle, tokenId, tipAmount, content, author, noteId } =
      event.params;
    const blockTimestamp = event.block.timestamp;

    const profile = await context.Profile.get(handle);
    if (profile && tipAmount > 0n) {
      context.Profile.set({
        ...profile,
        tipAmount: profile.tipAmount + tipAmount,
        updatedAt: blockTimestamp
      });
    }

    const entity: Note = {
      id: `note_${tokenId}-${noteId}-${author}`,
      to_id: handle,
      content: content,
      author,
      tipAmount,
      txHash: event.transaction.hash,
      createdAt: blockTimestamp
    };
    context.Note.set(entity);
  }
);

indexer.onEvent(
  { contract: "LinkFolio", event: "PostCreated" },
  async ({ event, context }) => {
    const { handle, tokenId, postId, content } = event.params;

    const entity: Post = {
      id: `post_${tokenId}-${postId}`,
      content,
      author_id: handle,
      createdAt: event.block.timestamp
    };
    context.Post.set(entity);
  }
);
