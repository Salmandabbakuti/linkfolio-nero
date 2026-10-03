import { describe, it } from "vitest";
import { createTestIndexer, TestHelpers } from "envio";

const address = TestHelpers.Addresses.defaultAddress;

describe("LinkFolio event handlers", () => {
  it("creates and updates profiles, notes, posts, and users", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        1689: {
          simulate: [
            {
              contract: "LinkFolio",
              event: "ProfileCreated",
              params: {
                tokenId: 1n,
                name: "Initial",
                handle: "alice",
                category: 0n,
                bio: "Initial bio",
                avatar: "initial.png",
                owner: address,
                eoa: address,
                linkKeys: ["website"],
                links: ["https://example.com"],
                settingsHash: "initial-settings"
              }
            },
            {
              contract: "LinkFolio",
              event: "ProfileUpdated",
              params: {
                tokenId: 1n,
                name: "Updated",
                handle: "alice",
                category: 1n,
                bio: "Updated bio",
                avatar: "updated.png",
                owner: address,
                linkKeys: ["social"],
                links: ["https://social.example"],
                settingsHash: "updated-settings"
              }
            },
            {
              contract: "LinkFolio",
              event: "NoteLeft",
              params: {
                tokenId: 1n,
                handle: "alice",
                noteId: 1n,
                content: "First note",
                author: address,
                tipAmount: 0n
              }
            },
            {
              contract: "LinkFolio",
              event: "NoteLeft",
              params: {
                tokenId: 1n,
                handle: "alice",
                noteId: 2n,
                content: "Tipped note",
                author: address,
                tipAmount: 5n
              }
            },
            {
              contract: "LinkFolio",
              event: "PostCreated",
              params: {
                tokenId: 1n,
                handle: "alice",
                postId: 1n,
                content: "Hello world",
                author: address
              }
            }
          ]
        }
      }
    });

    const user = await indexer.User.getOrThrow(address);
    t.expect(user.address).toBe(address);
    t.expect(user.scw).toBe(address);

    const profile = await indexer.Profile.getOrThrow("alice");
    t.expect(profile).toMatchObject({
      id: "alice",
      tokenId: 1n,
      name: "Updated",
      handle: "alice",
      category: "Creator",
      bio: "Updated bio",
      avatar: "updated.png",
      owner: address,
      eoa_id: address,
      tipAmount: 5n,
      linkKeys: ["social"],
      links: ["https://social.example"],
      settingsHash: "updated-settings"
    });

    const firstNote = await indexer.Note.getOrThrow(`note_1-1-${address}`);
    t.expect(firstNote).toMatchObject({
      to_id: "alice",
      content: "First note",
      author: address,
      tipAmount: 0n
    });
    t.expect(firstNote.txHash).toBeTypeOf("string");

    const tippedNote = await indexer.Note.getOrThrow(`note_1-2-${address}`);
    t.expect(tippedNote.tipAmount).toBe(5n);

    const post = await indexer.Post.getOrThrow("post_1-1");
    t.expect(post).toMatchObject({
      content: "Hello world",
      author_id: "alice"
    });
  });

  it("creates a profile from an update when no profile exists", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        1689: {
          simulate: [
            {
              contract: "LinkFolio",
              event: "ProfileUpdated",
              params: {
                tokenId: 2n,
                name: "New profile",
                handle: "bob",
                category: 2n,
                bio: "Created by update",
                avatar: "bob.png",
                owner: address,
                linkKeys: [],
                links: [],
                settingsHash: "bob-settings"
              }
            }
          ]
        }
      }
    });

    const profile = await indexer.Profile.getOrThrow("bob");
    t.expect(profile).toMatchObject({
      id: "bob",
      tokenId: 2n,
      name: "New profile",
      category: "Business",
      owner: address,
      eoa_id: address,
      tipAmount: 0n
    });
    t.expect(profile.createdAt).toBe(profile.updatedAt);
  });

  it("deletes an existing profile", async (t) => {
    const indexer = createTestIndexer();

    await indexer.process({
      chains: {
        1689: {
          simulate: [
            {
              contract: "LinkFolio",
              event: "ProfileCreated",
              params: {
                tokenId: 3n,
                name: "To delete",
                handle: "removed",
                category: 0n,
                bio: "",
                avatar: "",
                owner: address,
                eoa: address,
                linkKeys: [],
                links: [],
                settingsHash: ""
              }
            },
            {
              contract: "LinkFolio",
              event: "ProfileDeleted",
              params: { tokenId: 3n, handle: "removed" }
            }
          ]
        }
      }
    });

    t.expect(await indexer.Profile.get("removed")).toBeUndefined();
  });
});
