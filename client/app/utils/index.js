import { Contract, JsonRpcProvider } from "ethers";
import {
  XOutlined,
  FacebookOutlined,
  YoutubeOutlined,
  GithubOutlined,
  GlobalOutlined,
  DiscordOutlined,
  FrownOutlined,
  CodeOutlined,
  LinkedinOutlined,
  InstagramOutlined
} from "@ant-design/icons";
import { LINKFOLIO_CONTRACT_ADDRESS } from "./constants";

export const supportedSocials = [
  { id: "facebook", name: "Facebook", icon: <FacebookOutlined /> },
  { id: "youtube", name: "YouTube", icon: <YoutubeOutlined /> },
  { id: "github", name: "GitHub", icon: <GithubOutlined /> },
  { id: "snapchat", name: "Snapchat", icon: <GlobalOutlined /> },
  { id: "telegram", name: "Telegram", icon: <GlobalOutlined /> },
  { id: "discord", name: "Discord", icon: <DiscordOutlined /> },
  { id: "farcaster", name: "Farcaster", icon: <FrownOutlined /> },
  { id: "blockchain", name: "Blockchain", icon: <CodeOutlined /> },
  { id: "linkedin", name: "LinkedIn", icon: <LinkedinOutlined /> },
  { id: "x", name: "X", icon: <XOutlined /> },
  { id: "instagram", name: "Instagram", icon: <InstagramOutlined /> },
  { id: "other", name: "Other", icon: <GlobalOutlined /> }
];

const linkFolioContractABI = [
  "function createProfile(string _name, string _handle, string _bio, string _avatar, string[] _linkKeys, string[] _links)",
  "function updateProfile(uint256 _tokenId, string _name, string _bio, string _avatar, string[] _linkKeys, string[] _links)",
  "function deleteProfile(uint256 _tokenId)",
  "function getProfileByHandle(string _handle) view returns (uint256 tokenId, string name, string handle, string bio, string avatar, address owner, string[] linkKeys, string[] links)",
  "function handleToTokenId(string handle) view returns (uint256 tokenId)",
  "function profileExists(string handle) view returns (bool isExists)"
];

// nero testnet provider
const defaultProvider = new JsonRpcProvider(
  "https://rpc-testnet.nerochain.io",
  689,
  {
    staticNetwork: true
  }
);

export const linkFolioContract = new Contract(
  LINKFOLIO_CONTRACT_ADDRESS,
  linkFolioContractABI,
  defaultProvider
);
