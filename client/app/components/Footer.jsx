"use client";
import { Row, Col, Typography, Space, Divider } from "antd";
import {
  GithubOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  HeartFilled,
  RocketOutlined,
  CrownOutlined,
  GlobalOutlined
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: <GithubOutlined />,
      href: "https://github.com/Salmandabbakuti",
      label: "GitHub"
    },
    {
      icon: <TwitterOutlined />,
      href: "https://twitter.com/linkfolio",
      label: "Twitter"
    },
    {
      icon: <LinkedinOutlined />,
      href: "https://linkedin.com/company/linkfolio",
      label: "LinkedIn"
    }
  ];

  const quickLinks = [
    { href: "/", label: "Home" },
    { href: "/explore", label: "Explore Profiles" },
    { href: "#", label: "About" },
    { href: "#", label: "Contact" }
  ];

  const resources = [
    { href: "#", label: "Documentation" },
    { href: "#", label: "API Reference" },
    { href: "#", label: "Getting Started" },
    { href: "#", label: "FAQ" }
  ];

  return (
    <footer
      style={{
        background: "var(--surface)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border-color)",
        padding: "48px 0 24px",
        marginTop: "80px",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)",
          pointerEvents: "none"
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Main footer content */}
        <Row gutter={[48, 32]}>
          {/* Brand section */}
          <Col xs={24} sm={12} lg={8}>
            <div style={{ marginBottom: "24px" }}>
              <Title
                level={3}
                style={{
                  margin: "0 0 16px 0",
                  background: "var(--text-gradient)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                🔗 LinkFolio
                <CrownOutlined
                  style={{
                    fontSize: "20px",
                    color: "var(--secondary-color)"
                  }}
                />
              </Title>
              <Paragraph
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  marginBottom: "20px"
                }}
              >
                Create and own your digital identity as a soulbound NFT with
                on-chain metadata. Built on NERO Chain with gas-free
                transactions via Account Abstraction.
              </Paragraph>

              {/* Social links */}
              <Space size="middle">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "var(--surface-secondary)",
                      color: "var(--text-secondary)",
                      transition: "all var(--transition-normal)",
                      border: "1px solid var(--border-color)"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "var(--primary-gradient)";
                      e.target.style.color = "white";
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "var(--shadow-lg)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "var(--surface-secondary)";
                      e.target.style.color = "var(--text-secondary)";
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "none";
                    }}
                    title={social.label}
                  >
                    {social.icon}
                  </a>
                ))}
              </Space>
            </div>
          </Col>

          {/* Quick Links */}
          <Col xs={12} sm={6} lg={4}>
            <Title
              level={5}
              style={{
                color: "var(--text-primary)",
                marginBottom: "20px",
                fontWeight: "var(--font-weight-semibold)"
              }}
            >
              Quick Links
            </Title>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    transition: "all var(--transition-fast)",
                    display: "block",
                    padding: "4px 0"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--primary-color)";
                    e.target.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--text-secondary)";
                    e.target.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Resources */}
          <Col xs={12} sm={6} lg={4}>
            <Title
              level={5}
              style={{
                color: "var(--text-primary)",
                marginBottom: "20px",
                fontWeight: "var(--font-weight-semibold)"
              }}
            >
              Resources
            </Title>
            <Space direction="vertical" size="small" style={{ width: "100%" }}>
              {resources.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  style={{
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    transition: "all var(--transition-fast)",
                    display: "block",
                    padding: "4px 0"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--primary-color)";
                    e.target.style.paddingLeft = "8px";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--text-secondary)";
                    e.target.style.paddingLeft = "0";
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </Space>
          </Col>

          {/* Technology Stack */}
          <Col xs={24} sm={12} lg={8}>
            <Title
              level={5}
              style={{
                color: "var(--text-primary)",
                marginBottom: "20px",
                fontWeight: "var(--font-weight-semibold)"
              }}
            >
              <RocketOutlined style={{ marginRight: "8px" }} />
              Powered By
            </Title>
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px"
                }}
              >
                {[
                  { name: "NERO Chain", color: "#6366f1" },
                  { name: "Reown", color: "#ec4899" },
                  { name: "Next.js", color: "#000000" },
                  { name: "Ant Design", color: "#1677ff" },
                  { name: "Account Abstraction", color: "#10b981" }
                ].map((tech, index) => (
                  <span
                    key={index}
                    style={{
                      padding: "4px 12px",
                      background: `${tech.color}15`,
                      color: tech.color,
                      borderRadius: "12px",
                      fontSize: "12px",
                      fontWeight: "var(--font-weight-medium)",
                      border: `1px solid ${tech.color}30`
                    }}
                  >
                    {tech.name}
                  </span>
                ))}
              </div>

              <div
                style={{
                  padding: "16px",
                  background: "var(--surface-secondary)",
                  borderRadius: "12px",
                  border: "1px solid var(--border-color)"
                }}
              >
                <Text
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <GlobalOutlined />
                  Built with{" "}
                  <HeartFilled style={{ color: "var(--error-color)" }} /> for
                  the decentralized web
                </Text>
              </div>
            </Space>
          </Col>
        </Row>

        <Divider
          style={{
            margin: "40px 0 24px",
            borderColor: "var(--border-color)"
          }}
        />

        {/* Bottom section */}
        <Row
          justify="space-between"
          align="middle"
          style={{ flexWrap: "wrap-reverse", gap: "16px" }}
        >
          <Col>
            <Text
              style={{
                color: "var(--text-muted)",
                fontSize: "14px"
              }}
            >
              © {currentYear} LinkFolio. All rights reserved.{" "}
              <span style={{ margin: "0 8px" }}>•</span>
              <Link
                href="#"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "underline"
                }}
              >
                Privacy Policy
              </Link>
              <span style={{ margin: "0 8px" }}>•</span>
              <Link
                href="#"
                style={{
                  color: "var(--text-muted)",
                  textDecoration: "underline"
                }}
              >
                Terms of Service
              </Link>
            </Text>
          </Col>
          <Col>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 12px",
                background: "var(--surface-secondary)",
                borderRadius: "20px",
                border: "1px solid var(--border-color)"
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--success-color)",
                  animation: "pulse 2s infinite"
                }}
              />
              <Text
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: "var(--font-weight-medium)"
                }}
              >
                v0.4.0 • All systems operational
              </Text>
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  );
}
