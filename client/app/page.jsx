"use client";
import { useState, useEffect } from "react";
import {
  Typography,
  Input,
  Button,
  Space,
  message,
  Divider,
  List,
  Select,
  Card,
  Avatar
} from "antd";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppKitAccount, useAppKitProvider } from "@reown/appkit/react";
import { BrowserProvider } from "ethers";
import {
  linkFolioContract,
  subgraphClient as client,
  GET_PROFILES_QUERY
} from "@/app/utils";
import { getAAWalletAddress } from "@/app/utils/aaUtils";

const { Title, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;
import { SyncOutlined } from "@ant-design/icons";

export default function Home() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [showMyProfiles, setShowMyProfiles] = useState(false);
  const [aaWalletAddress, setAAWalletAddress] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const { address: account } = useAppKitAccount();
  const { walletProvider } = useAppKitProvider("eip155");

  const handleInputChange = (e) => {
    setHandle(e.target.value);
  };

  const fetchProfiles = () => {
    setDataLoading(true);
    client
      .request(GET_PROFILES_QUERY, {
        first: 30,
        skip: 0,
        orderBy: "createdAt",
        orderDirection: "desc",
        where: {
          and: [
            { owner: showMyProfiles ? aaWalletAddress : undefined },
            ...(searchQuery
              ? [
                  {
                    or: [
                      {
                        name_contains_nocase: searchQuery
                      },
                      {
                        handle_contains_nocase: searchQuery
                      },
                      {
                        bio_contains_nocase: searchQuery
                      },
                      {
                        owner_contains_nocase: searchQuery
                      }
                    ]
                  }
                ]
              : [])
          ]
        }
      })
      .then((data) => {
        console.log("Profiles fetched", data?.profiles);
        setProfiles(data?.profiles || []);
      })
      .catch((err) => {
        console.error("Error while fetching profiles", err);
        message.error("Something went wrong. Please try again!");
      })
      .finally(() => {
        setDataLoading(false);
      });
  };

  const resolveAAWalletAddress = async () => {
    if (!walletProvider) return;
    try {
      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const aaWalletAddress = await getAAWalletAddress(signer);
      console.log(
        `Resolved AA Wallet Address for account ${account}: ${aaWalletAddress}`
      );
      setAAWalletAddress(aaWalletAddress?.toLowerCase());
    } catch (err) {
      console.error("Error resolving AA Wallet Address:", err);
    }
  };

  useEffect(() => {
    fetchProfiles();
    if (account) {
      resolveAAWalletAddress();
    }
  }, [showMyProfiles, account]);

  const handleClaim = async () => {
    // handle length should be between 3 and 15 characters
    if (handle.length < 3 || handle.length > 15) {
      return message.error("Handle should be between 3 and 15 characters");
    }
    if (handle.includes(" ")) {
      return message.error("Handle should not contain spaces");
    }
    setLoading(true);
    try {
      const handleTokenId = await linkFolioContract.handleToTokenId(handle);
      console.log("Claiming handle token ID", handleTokenId);
      // if handleTokenId is not 0n, it means the handle is already taken
      if (handleTokenId !== 0n) {
        return message.error(
          `${handle} is already taken. Please try another one.`
        );
      }
      router.push(`/${handle}?mode=claim`);
    } catch (err) {
      console.error("Error while checking handle availability", err);
      message.error(
        err?.shortMessage || "Something went wrong. Please try again!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Title level={2}>Own Your Digital Identity. Forever.</Title>
      <Paragraph>
        Join LinkFolio! Your decentralized, portable, and ownable Link Hub.
        Seamlessly share your creations across Instagram, TikTok, Twitter,
        YouTube, and beyond—all with one simple link.
      </Paragraph>
      <Space.Compact>
        <Input
          size="large"
          placeholder="Enter your handle"
          value={handle}
          onChange={handleInputChange}
          prefix="link.fo/"
        />
        <Button
          type="primary"
          size="large"
          shape="round"
          loading={loading}
          onClick={handleClaim}
        >
          Claim
        </Button>
      </Space.Compact>
      <Divider />
      <div style={{ marginTop: "20px" }}>
        <Title level={2}>Discover</Title>
        <Paragraph type="secondary">
          Explore amazing profiles from our community
        </Paragraph>
        <Space style={{ marginBottom: "20px" }}>
          <Search
            size="default"
            allowClear
            placeholder="Search profiles"
            onSearch={fetchProfiles}
            onPressEnter={fetchProfiles}
            enterButton
            loading={dataLoading}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "300px" }}
          />

          <label>Owned by:</label>
          <Select
            style={{ width: 120 }}
            defaultValue={false}
            onChange={(value) => {
              setShowMyProfiles(value);
            }}
          >
            <Option value={false}>All</Option>
            <Option value={true} disabled={!account}>
              Me
            </Option>
          </Select>
          <Button
            type="primary"
            shape="circle"
            icon={<SyncOutlined spin={dataLoading} />}
            onClick={fetchProfiles}
          />
        </Space>
        <List
          grid={{
            xs: 1,
            gutter: 16
          }}
          dataSource={profiles}
          loading={dataLoading}
          itemLayout="vertical"
          renderItem={(item) => (
            <List.Item>
              <Card
                hoverable
                variant="bordered"
                style={{
                  width: 340,
                  textAlign: "center",
                  borderRadius: "10px",
                  padding: "10px"
                  // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                }}
                actions={[
                  <Link href={`/${item?.handle}`}>
                    <Button variant="outlined" color="primary" shape="round">
                      View Profile
                    </Button>
                  </Link>
                ]}
              >
                <Avatar
                  src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${item?.handle}`}
                  alt="avatar"
                  size={100}
                  shape="circle"
                  style={{ border: "1px solid grey" }}
                />

                <h3>{item?.name}</h3>
                <p>@{item?.handle}</p>
                <p>{item?.bio}</p>
              </Card>
            </List.Item>
          )}
        />
      </div>
    </div>
  );
}
