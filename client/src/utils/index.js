import { Contract, JsonRpcProvider } from "ethers";
import { GraphQLClient, gql } from "graphql-request";
import { LINKFOLIO_CONTRACT_ADDRESS } from "./constants";

export const DEFAULT_APPEARANCE_SETTINGS = {
  fontFamily: "Inter, sans-serif",
  fontSize: 16,
  background: "#1F1A2D",
  accentColor: "#1890FF",
  cardStyle: "solid",
  buttonShape: "pill",
  linkStyle: "bold",
  textColor: "#E8E8E8",
  avatarShape: "circle",
  banner: ""
};

// nero mainnet provider
const defaultProvider = new JsonRpcProvider("https://rpc.nerochain.io", 1689, {
  staticNetwork: true
});

const linkFolioContractABI = [
  "function createProfile(string _name, string _handle, uint8 _category, string _bio, string _avatar, string[] _linkKeys, string[] _links, address _eoa, string _settingsHash)",
  "function updateProfile(uint256 _tokenId, string _name, uint8 _category, string _bio, string _avatar, string[] _linkKeys, string[] _links, string _settingsHash)",
  "function deleteProfile(uint256 _tokenId)",
  "function leaveNote(string _handle, string _content) payable",
  "function createPost(uint256 _tokenId, string _content)",
  "function profiles(uint256 tokenId) view returns (uint256 tokenId, string name, string handle, uint8 category, string bio, string avatar, address owner, address _eoa)",
  "function handleToTokenId(string handle) view returns (uint256 tokenId)",
  "function tokenURI(uint256 tokenId) view returns (string uri)"
];

export const linkFolioContract = new Contract(
  LINKFOLIO_CONTRACT_ADDRESS,
  linkFolioContractABI,
  defaultProvider
);

const indexerQueryUrl =
  import.meta.env.VITE_INDEXER_QUERY_URL ||
  "https://indexer.dev.hyperindex.xyz/a3b7607/v1/graphql";

export const graphqlClient = new GraphQLClient(indexerQueryUrl);

export const GET_PROFILES_QUERY = gql`
  query getProfiles(
    $limit: Int
    $offset: Int
    $where: Profile_bool_exp
    $order_by: [Profile_order_by!]
  ) {
    profiles: Profile(
      limit: $limit
      offset: $offset
      order_by: $order_by
      where: $where
    ) {
      id
      tokenId
      name
      handle
      category
      bio
      avatar
      eoa {
        id
      }
      tipAmount
      owner
    }
  }
`;

export const GET_PROFILE_QUERY = gql`
  query getProfile(
    $id: String!
    $chainId: Int!
    $notes_limit: Int
    $notes_offset: Int
    $notes_order_by: [Note_order_by!]
    $posts_limit: Int
    $posts_offset: Int
    $posts_order_by: [Post_order_by!]
  ) {
    profile: Profile_by_pk(id: $id, chainId: $chainId) {
      id
      tokenId
      name
      handle
      category
      bio
      avatar
      eoa {
        id
      }
      owner
      tipAmount
      linkKeys
      links
      settingsHash
      notes(
        limit: $notes_limit
        offset: $notes_offset
        order_by: $notes_order_by
      ) {
        id
        content
        author
        tipAmount
        txHash
        createdAt
      }
      posts(
        limit: $posts_limit
        offset: $posts_offset
        order_by: $posts_order_by
      ) {
        id
        content
        author {
          id
          name
          handle
          avatar
        }
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const PROFILE_EXISTS_QUERY = gql`
  query profile($id: String!, $chainId: Int!) {
    profile: Profile_by_pk(id: $id, chainId: $chainId) {
      id
      handle
    }
  }
`;

export const ellipsisString = (str, first, last) =>
  str.slice(0, first) + "..." + str.slice(-last);
