"use client";
import { useState } from "react";
import {
  Button,
  Typography,
  Card,
  Row,
  Col,
  Space,
  Input,
  message,
  Steps
} from "antd";
import {
  RocketOutlined,
  CheckCircleOutlined,
  StarFilled,
  UserOutlined,
  LinkOutlined,
  ShareAltOutlined,
  CrownOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  GlobalOutlined,
  DollarOutlined,
  NotificationOutlined
} from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { linkFolioContract } from "@/app/utils";
import Hero from "./components/Hero";

const { Title, Paragraph } = Typography;

const howItWorksSteps = [
  {
    icon: (
      <UserOutlined
        style={{ fontSize: "24px", color: "var(--primary-color)" }}
      />
    ),
    title: "Connect Wallet",
    description:
      "Connect your wallet with one click - no complex setup required"
  },
  {
    icon: (
      <CrownOutlined
        style={{ fontSize: "24px", color: "var(--secondary-color)" }}
      />
    ),
    title: "Choose Template",
    description:
      "Pick from our professionally designed templates or customize your own"
  },
  {
    icon: (
      <LinkOutlined
        style={{ fontSize: "24px", color: "var(--accent-color)" }}
      />
    ),
    title: "Add Content & Links",
    description:
      "Add your social links, bio, and customize your profile appearance with themes and colors"
  },
  {
    icon: (
      <ShareAltOutlined
        style={{ fontSize: "24px", color: "var(--success-color)" }}
      />
    ),
    title: "Share & Mint",
    description:
      "Publish your profile as a soulbound NFT and share it with the world"
  },
  {
    icon: (
      <NotificationOutlined
        style={{ fontSize: "24px", color: "var(--warning-color)" }}
      />
    ),
    title: "Create Posts",
    description:
      "Share updates, announcements, and content with your audience through dynamic posts"
  },
  {
    icon: (
      <DollarOutlined
        style={{ fontSize: "24px", color: "var(--primary-color)" }}
      />
    ),
    title: "Receive Notes & Tips",
    description:
      "Your community can leave notes on your profile and send tips to support your work"
  }
];

const features = [
  {
    icon: (
      <CrownOutlined
        style={{ fontSize: "32px", color: "var(--secondary-color)" }}
      />
    ),
    title: "Soulbound NFT Profiles",
    description:
      "Each profile is minted as a unique, non-transferrable NFT ensuring true ownership and authenticity.",
    highlight: true
  },
  {
    icon: (
      <ThunderboltOutlined
        style={{ fontSize: "32px", color: "var(--warning-color)" }}
      />
    ),
    title: "Gas-Free Transactions",
    description:
      "Enjoy seamless interactions with zero gas fees powered by NERO Chain's Account Abstraction technology.",
    highlight: true
  },
  {
    icon: (
      <SafetyOutlined
        style={{ fontSize: "32px", color: "var(--success-color)" }}
      />
    ),
    title: "On-Chain Metadata",
    description:
      "All profile data is stored directly on-chain, ensuring permanence, integrity, and decentralization."
  },
  {
    icon: (
      <GlobalOutlined
        style={{ fontSize: "32px", color: "var(--primary-color)" }}
      />
    ),
    title: "Customizable Design",
    description:
      "Personalize your profile with custom themes, colors, fonts, and layouts to match your brand."
  },
  {
    icon: (
      <StarFilled style={{ fontSize: "32px", color: "var(--accent-color)" }} />
    ),
    title: "Social Features",
    description:
      "Receive tips, messages, and interact with your community through built-in social features."
  },
  {
    icon: (
      <CheckCircleOutlined
        style={{ fontSize: "32px", color: "var(--success-color)" }}
      />
    ),
    title: "Easy Integration",
    description:
      "Simple APIs and tools to integrate LinkFolio profiles into your existing applications and workflows."
  }
];

export default function Home() {
  const [handle, setHandle] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
  const handleGetStarted = () => {
    const handleInput = document.getElementById("handle-input");
    if (handleInput) {
      handleInput.scrollIntoView({ behavior: "smooth" });
      handleInput.focus();
    }
  };

  return (
    <div
      style={{
        background: "transparent",
        minHeight: "100vh"
      }}
    >
      {/* Hero Section */}
      <Hero onGetStarted={handleGetStarted} />
      {/* How It Works Section */}
      <section
        style={{
          padding: "80px 0",
          background: "rgba(255, 255, 255, 0.02)",
          backdropFilter: "blur(10px)",
          position: "relative"
        }}
      >
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Title
              level={2}
              style={{
                background: "var(--text-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)"
              }}
            >
              How LinkFolio Works
            </Title>
            <Paragraph
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              Create your decentralized profile in minutes with our simple,
              intuitive process
            </Paragraph>
          </div>{" "}
          <Steps
            direction="vertical"
            size="default"
            current={-1}
            style={{
              maxWidth: "800px",
              margin: "0 auto",
              "--ant-color-text": "var(--text-primary)",
              "--ant-color-text-secondary": "var(--text-secondary)",
              "--ant-color-text-description": "var(--text-secondary)"
            }}
            items={howItWorksSteps.map((step, index) => ({
              title: (
                <span
                  style={{
                    color: "var(--text-primary)",
                    fontSize: "18px",
                    fontWeight: "var(--font-weight-semibold)"
                  }}
                >
                  {step.title}
                </span>
              ),
              description: (
                <span
                  style={{ color: "var(--text-secondary)", fontSize: "14px" }}
                >
                  {step.description}
                </span>
              ),
              icon: step.icon,
              style: {
                paddingBottom: index === howItWorksSteps.length - 1 ? 0 : "40px"
              }
            }))}
          />
        </div>
      </section>
      {/* Profile Customization Showcase Section */}
      <section
        style={{
          padding: "80px 0",
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)",
          position: "relative"
        }}
      >
        <div className="container">
          {" "}
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Title
              level={2}
              style={{
                background: "var(--text-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)"
              }}
            >
              🎨 Customize Your Style
            </Title>
            <Paragraph
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "600px",
                margin: "0 auto"
              }}
            >
              Start with a template or build from scratch - make it uniquely
              yours
            </Paragraph>
          </div>{" "}
          <Row gutter={[32, 32]} justify="center">
            {/* Combined Templates & Customization Card */}
            <Col xs={24} lg={16}>
              <div
                style={{
                  textAlign: "center",
                  padding: "40px 32px",
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  height: "100%"
                }}
              >
                <div style={{ fontSize: "48px", marginBottom: "20px" }}>🎨</div>
                <Title
                  level={3}
                  style={{
                    color: "var(--text-primary)",
                    marginBottom: "16px"
                  }}
                >
                  Templates & Customization
                </Title>
                <Paragraph
                  style={{
                    color: "var(--text-secondary)",
                    marginBottom: "32px",
                    maxWidth: "500px",
                    margin: "0 auto 32px"
                  }}
                >
                  Start with professional templates or build from scratch with
                  advanced customization tools
                </Paragraph>
                {/* Template Preview Cards */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "16px",
                    marginBottom: "32px",
                    maxWidth: "600px",
                    margin: "0 auto 32px"
                  }}
                >
                  {[
                    { name: "Modern Glass", bg: "#E3F2FD", accent: "#1565C0" },
                    { name: "Retro Vibes", bg: "#FCE4EC", accent: "#AD1457" },
                    { name: "Dark Mode", bg: "#263238", accent: "#00BCD4" },
                    { name: "Minimalist", bg: "#FAFAFA", accent: "#424242" }
                  ].map((template, index) => (
                    <div
                      key={index}
                      style={{
                        height: "100px",
                        background: template.bg,
                        borderRadius: "12px",
                        border: "2px solid rgba(255,255,255,0.1)",
                        position: "relative",
                        cursor: "pointer",
                        transition: "all var(--transition-normal)",
                        overflow: "hidden"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-4px)";
                        e.target.style.boxShadow = "var(--shadow-lg)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      {/* Template preview elements */}
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          left: "8px",
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: template.accent,
                          opacity: 0.8
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "30px",
                          left: "8px",
                          right: "8px",
                          height: "3px",
                          background: template.accent,
                          borderRadius: "2px",
                          opacity: 0.6
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "38px",
                          left: "8px",
                          width: "60%",
                          height: "2px",
                          background: template.accent,
                          borderRadius: "1px",
                          opacity: 0.4
                        }}
                      />

                      <div
                        style={{
                          position: "absolute",
                          bottom: "6px",
                          left: "8px",
                          fontSize: "10px",
                          fontWeight: "bold",
                          color: template.accent
                        }}
                      >
                        {template.name}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Customization Features */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    marginBottom: "24px"
                  }}
                >
                  {[
                    { name: "Colors", icon: "🎨" },
                    { name: "Fonts", icon: "📝" },
                    { name: "Layouts", icon: "🎯" },
                    { name: "Shapes", icon: "🔘" }
                  ].map((feature, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "8px 16px",
                        background: "rgba(255, 255, 255, 0.1)",
                        borderRadius: "20px",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        transition: "all var(--transition-normal)",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.15)";
                        e.target.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.1)";
                        e.target.style.transform = "translateY(0)";
                      }}
                    >
                      <span style={{ fontSize: "14px" }}>{feature.icon}</span>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: "var(--font-weight-medium)",
                          color: "var(--text-primary)"
                        }}
                      >
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Real-time Preview Badge */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 16px",
                    background:
                      "linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(236, 72, 153, 0.15) 100%)",
                    borderRadius: "20px",
                    border: "1px solid rgba(102, 126, 234, 0.3)"
                  }}
                >
                  <span style={{ fontSize: "14px" }}>🔥</span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "var(--font-weight-medium)",
                      color: "var(--text-primary)"
                    }}
                  >
                    Real-time preview
                  </span>
                </div>{" "}
              </div>
            </Col>
          </Row>
        </div>
      </section>
      {/* Features Section */}
      <section style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <Title
              level={2}
              style={{
                background: "var(--text-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px",
                fontSize: "clamp(1.8rem, 4vw, 2.5rem)"
              }}
            >
              Why Choose LinkFolio?
            </Title>
            <Paragraph
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                maxWidth: "700px",
                margin: "0 auto"
              }}
            >
              Built for the future of digital identity with cutting-edge
              blockchain technology
            </Paragraph>
          </div>

          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col key={index} xs={24} md={12} lg={8}>
                <Card
                  style={{
                    height: "100%",
                    background: feature.highlight
                      ? "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)"
                      : "var(--surface)",
                    border: feature.highlight
                      ? "2px solid rgba(102, 126, 234, 0.2)"
                      : "1px solid var(--border-color)",
                    borderRadius: "16px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                  styles={{ body: { padding: "32px 24px" } }}
                  hoverable
                >
                  {feature.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: "16px",
                        right: "16px",
                        background: "var(--secondary-color)",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "10px",
                        fontWeight: "bold"
                      }}
                    >
                      POPULAR
                    </div>
                  )}

                  <div style={{ marginBottom: "20px" }}>{feature.icon}</div>

                  <Title
                    level={4}
                    style={{
                      marginBottom: "12px",
                      color: "var(--text-primary)"
                    }}
                  >
                    {feature.title}
                  </Title>

                  <Paragraph
                    style={{
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      margin: 0
                    }}
                  >
                    {feature.description}
                  </Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>
      {/* Get Started Section */}
      <section
        style={{
          padding: "80px 0",
          background:
            "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        <div className="container">
          <div
            style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto" }}
          >
            <Title
              level={2}
              style={{
                background: "var(--text-gradient)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "16px"
              }}
            >
              Ready to Get Started?
            </Title>
            <Paragraph
              style={{
                fontSize: "1.1rem",
                color: "var(--text-secondary)",
                marginBottom: "40px"
              }}
            >
              Enter your desired handle to check availability and create your
              LinkFolio
            </Paragraph>

            <Space.Compact
              size="large"
              style={{ width: "100%", maxWidth: "400px" }}
            >
              <Input
                id="handle-input"
                placeholder="Enter your handle (e.g., john)"
                value={handle}
                onChange={(e) => setHandle(e.target.value.toLowerCase())}
                onPressEnter={handleClaim}
                style={{
                  height: "52px",
                  fontSize: "16px",
                  borderRadius: "26px 0 0 26px"
                }}
                maxLength={20}
              />
              <Button
                type="primary"
                onClick={handleClaim}
                loading={loading}
                disabled={!handle.trim()}
                icon={<RocketOutlined />}
                style={{
                  height: "52px",
                  padding: "0 24px",
                  fontSize: "16px",
                  borderRadius: "0 26px 26px 0"
                }}
              >
                Get Started
              </Button>
            </Space.Compact>

            <div style={{ marginTop: "16px" }}>
              <Paragraph
                style={{
                  fontSize: "14px",
                  color: "var(--text-muted)",
                  margin: 0
                }}
              >
                💡 Tip: Choose a memorable handle that represents your brand
              </Paragraph>
            </div>
          </div>
        </div>
      </section>{" "}
    </div>
  );
}
