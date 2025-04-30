"use client";
import { useState } from "react";
import { Typography, Input, Button, Space, message } from "antd";
import { useRouter } from "next/navigation";
import { linkFolioContract } from "./utils";

const { Title, Paragraph } = Typography;

export default function Home() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleInputChange = (e) => {
    setHandle(e.target.value);
  };

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
      const handleExists = await linkFolioContract.profileExists(handle);
      if (handleExists)
        return message.error(
          `${handle} is already taken. Please try another one.`
        );
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
      <Space>
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
      </Space>
    </div>
  );
}
