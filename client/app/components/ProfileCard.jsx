import { useState, useMemo } from "react";
import {
  Avatar,
  Descriptions,
  Tabs,
  List,
  Input,
  Button,
  message,
  Space,
  Typography,
  Divider,
  Tag,
  InputNumber
} from "antd";
import {
  LinkOutlined,
  DollarOutlined,
  ExportOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useAppKitProvider,
  useAppKitAccount,
  useAppKitState
} from "@reown/appkit/react";
import { BrowserProvider, parseEther, formatEther } from "ethers";
import {
  supportedSocials,
  ellipsisString,
  linkFolioContract
} from "@/app/utils";
import { executeOperation } from "@/app/utils/aaUtils";
import { EXPLORER_URL } from "@/app/utils/constants";

dayjs.extend(relativeTime);

const { Paragraph } = Typography;

export default function ProfileCard({ profile, aaWalletAddress }) {
  const [postInput, setPostInput] = useState("");
  const [noteInput, setNoteInput] = useState("");
  const [tipAmount, setTipAmount] = useState("");
  const [loading, setLoading] = useState({
    createPost: false,
    leaveNote: false
  });

  // Suggested tip amounts in NERO
  const suggestedTips = [
    { label: "No tip", value: "0" },
    { label: "0.5 NERO", value: "0.5" },
    { label: "1 NERO", value: "1" },
    { label: "5 NERO", value: "5" },
    { label: "25 NERO", value: "25" },
    { label: "50 NERO", value: "50" }
  ];

  const { address: account } = useAppKitAccount();
  const { selectedNetworkId } = useAppKitState();
  const { walletProvider } = useAppKitProvider("eip155");

  const isProfileOwner = useMemo(
    () =>
      aaWalletAddress &&
      profile?.owner?.toLowerCase() === aaWalletAddress?.toLowerCase(),
    [aaWalletAddress, profile]
  );

  const handleLeaveNote = async () => {
    // check if note input is between 1 and 280 characters
    if (noteInput.length < 1 || noteInput.length > 280)
      return message.error("Note must be between 1 and 280 characters");
    if (!account) return message.error("Please connect your wallet first");
    if (selectedNetworkId !== "eip155:689")
      return message.error("Please switch to NERO Testnet");

    // Validate tip amount
    const finalTipAmount = tipAmount || "0";
    if (isNaN(finalTipAmount) || parseFloat(finalTipAmount) < 0)
      return message.error("Please enter a valid tip amount");

    setLoading((prev) => ({ ...prev, leaveNote: true }));
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      // Convert tip amount to wei if > 0
      const tipAmountWei =
        parseFloat(finalTipAmount) > 0 ? parseEther(finalTipAmount) : 0n;

      const leaveNoteTx = await linkFolioContract
        .connect(signer)
        .leaveNote(profile?.handle, noteInput, {
          value: tipAmountWei
        });
      console.log("Leave note tx:", leaveNoteTx);
      await leaveNoteTx.wait();
      message.success(
        `Note left successfully!${
          parseFloat(finalTipAmount) > 0
            ? ` Thank you for tipping ${finalTipAmount} NERO!`
            : ""
        }`
      );
      // add the new note to the profile notes
      profile.notes = [
        {
          id: leaveNoteTx,
          author: account,
          content: noteInput,
          tipAmount: tipAmountWei.toString(),
          createdAt: Math.floor(Date.now() / 1000)
        },
        ...profile.notes
      ];
      setNoteInput("");
      setTipAmount("");
    } catch (error) {
      console.error("Error leaving note:", error);
      message.error("Failed to leave note. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, leaveNote: false }));
    }
  };

  const handleCreatePost = async () => {
    // check if post input is between 1 and 1000 characters
    if (postInput.length < 1 || postInput.length > 1000)
      return message.error("Post must be between 1 and 1000 characters");
    if (!account) return message.error("Please connect your wallet first");
    if (selectedNetworkId !== "eip155:689")
      return message.error("Please switch to NERO Testnet");
    setLoading((prev) => ({ ...prev, createPost: true }));
    try {
      const provider = new BrowserProvider(walletProvider);
      const signer = await provider.getSigner();
      const createPostOpTx = await executeOperation(
        signer,
        linkFolioContract.target,
        "createPost",
        [profile?.id, postInput]
      );
      console.log("Create post operation transaction:", createPostOpTx);
      message.success("Post created successfully!");
      // add the new post to the profile posts
      profile.posts = [
        {
          id: createPostOpTx,
          author: {
            id: profile?.id,
            handle: profile?.handle,
            name: profile?.name
          },
          content: postInput,
          createdAt: Math.floor(Date.now() / 1000)
        },
        ...profile.posts
      ];
      setPostInput("");
    } catch (error) {
      console.error("Error creating post:", error);
      message.error("Failed to create post. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, createPost: false }));
    }
  };

  const items = Object.keys(profile?.links || {})
    .map((key) => {
      const link = profile?.links[key];
      if (link) {
        const social = supportedSocials.find((s) => s.id === key);
        return {
          key,
          children: (
            <a href={link} target="_blank" rel="noopener noreferrer">
              {social?.icon || <LinkOutlined />} {social?.name || "-"}
            </a>
          )
        };
      }
    })
    .filter(Boolean);

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <Avatar
          src={
            profile?.avatar?.fileList?.[0]?.thumbUrl ||
            profile?.avatar ||
            `https://api.dicebear.com/5.x/open-peeps/svg?seed=${profile?.handle}`
          }
          alt="Profile"
          size={100}
          shape="circle"
          style={{ border: "1px solid grey" }}
        />
        <h2>{profile?.name}</h2>
        <p>@{profile?.handle}</p>
        <p>{profile?.bio}</p>
        <Tag
          bordered={false}
          color={
            profile?.category === "Personal"
              ? "magenta"
              : profile?.category === "Business"
              ? "blue"
              : profile?.category === "Creator"
              ? "green"
              : "default"
          }
        >
          {profile?.category}
        </Tag>
        {/* tabs with links, posts, notes */}
      </div>
      <Tabs
        defaultActiveKey="links"
        // activeKey={activeTab}
        onChange={(key) => {
          // const urlSearchParams = new URLSearchParams(window.location.search);
          // urlSearchParams.set("tab", key);
          // router.push(`${pathname}?${urlSearchParams.toString()}`);
          // router.push(`${pathname}?tab=${key}`);
        }}
        items={[
          {
            key: "links",
            label: "Links",
            children: <Descriptions column={2} colon={false} items={items} />
          },
          {
            key: "posts",
            label: "Posts",
            children: (
              <>
                <Paragraph type="secondary">
                  📢 Stay in the loop — see what this creator is sharing with
                  the world.
                </Paragraph>
                {isProfileOwner && (
                  <>
                    <Input.TextArea
                      placeholder="Share what you're building. Updates, ideas, milestones — your space, your voice."
                      value={postInput}
                      rows={4}
                      autoSize={{ minRows: 3, maxRows: 6 }}
                      maxLength={1000}
                      showCount
                      onChange={(e) => setPostInput(e.target.value)}
                      onPressEnter={handleCreatePost}
                      style={{ marginBottom: "16px" }}
                    />
                    <Button
                      type="primary"
                      shape="round"
                      onClick={handleCreatePost}
                      loading={loading?.createPost}
                    >
                      Submit
                    </Button>
                  </>
                )}
                <Divider />
                <Typography.Text strong>
                  Posts ({profile?.posts?.length || 0})
                </Typography.Text>
                <List
                  dataSource={profile?.posts || []}
                  itemLayout="horizontal"
                  split
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            shape="circle"
                            size="small"
                            style={{
                              cursor: "pointer",
                              border: "1px solid grey"
                            }}
                            src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${item?.author?.id}`}
                          />
                        }
                        title={
                          <Space>
                            <Typography.Text strong>
                              {item?.author?.name}
                            </Typography.Text>
                            <Typography.Text type="secondary">
                              {dayjs(item?.createdAt * 1000).fromNow()}
                            </Typography.Text>
                          </Space>
                        }
                        description={item?.content}
                      />
                    </List.Item>
                  )}
                />
              </>
            )
          },
          {
            key: "notes",
            label: "Notes",
            children: (
              <>
                <Paragraph type="secondary">
                  ✍️ Got something to say? Leave a note and make their day! Your
                  notes will be visible to the community.
                </Paragraph>
                <Input.TextArea
                  placeholder="Drop a quick thought, shout-out, or question for this creator."
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  rows={2}
                  maxLength={280}
                  showCount
                  style={{ marginBottom: "0.5em" }}
                />
                <Space wrap style={{ marginBottom: "0.5em" }}>
                  {suggestedTips.map((tip) => (
                    <Button
                      key={tip.label}
                      size="small"
                      type={tipAmount === tip.value ? "primary" : "default"}
                      onClick={() => setTipAmount(tip.value)}
                      style={{ minWidth: 60 }}
                    >
                      {tip.label}
                    </Button>
                  ))}
                  <InputNumber
                    size="small"
                    placeholder="Custom"
                    value={tipAmount}
                    onChange={(value) => setTipAmount(value)}
                    min={0}
                    step={0.1}
                    precision={2}
                    style={{ maxWidth: 170, verticalAlign: "middle" }}
                    addonAfter="NERO"
                  />
                  {tipAmount && parseFloat(tipAmount) > 0 ? (
                    <Typography.Text
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginTop: "8px"
                      }}
                    >
                      💡 Tip will be sent directly to the profile owner
                    </Typography.Text>
                  ) : null}
                </Space>
                <Button
                  type="primary"
                  shape="round"
                  onClick={handleLeaveNote}
                  loading={loading?.leaveNote}
                  icon={<DollarOutlined />}
                >
                  {tipAmount && parseFloat(tipAmount) > 0
                    ? `Submit with ${tipAmount} NERO tip`
                    : "Submit Note"}
                </Button>
                <Divider />
                <Typography.Text strong>
                  Notes ({profile?.notes?.length || 0})
                </Typography.Text>
                <List
                  itemLayout="horizontal"
                  split
                  dataSource={profile?.notes || []}
                  renderItem={(item) => {
                    const isTipped = parseFloat(item?.tipAmount || "0") > 0;
                    return (
                      <List.Item
                        style={
                          isTipped
                            ? {
                                background:
                                  "linear-gradient(90deg, #fffbe6 60%, #ffe58f 100%)",
                                border: "1px solid #ffd700",
                                borderRadius: "8px",
                                marginBottom: "8px"
                              }
                            : { background: "transparent" }
                        }
                      >
                        <List.Item.Meta
                          avatar={
                            <Avatar
                              shape="circle"
                              size="small"
                              style={{
                                cursor: "pointer",
                                border: "1px solid grey"
                              }}
                              src={`https://api.dicebear.com/5.x/open-peeps/svg?seed=${item?.author}`}
                            />
                          }
                          title={
                            <Space wrap>
                              <Typography.Text strong>
                                {ellipsisString(item?.author, 8, 5)}
                              </Typography.Text>
                              <Typography.Text type="secondary">
                                {dayjs(item?.createdAt * 1000).fromNow()}
                              </Typography.Text>
                              {isTipped && (
                                <>
                                  <Tag color="gold" icon={<DollarOutlined />}>
                                    {formatEther(item?.tipAmount)} NERO
                                  </Tag>
                                  <a
                                    href={`${EXPLORER_URL}/tx/${item?.txHash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <ExportOutlined title="View on Explorer" />
                                  </a>
                                </>
                              )}
                            </Space>
                          }
                          description={item?.content}
                        />
                      </List.Item>
                    );
                  }}
                />
              </>
            )
          }
        ]}
      />
    </>
  );
}
