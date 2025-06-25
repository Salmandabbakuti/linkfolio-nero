"use client";
import { Typography, Button, Space, Row, Col } from "antd";
import {
  RocketOutlined,
  CrownOutlined,
  StarFilled,
  ArrowRightOutlined,
  PlayCircleOutlined,
  CompassOutlined
} from "@ant-design/icons";
import { useState } from "react";
import Link from "next/link";

const { Title, Paragraph } = Typography;

export default function Hero({ onGetStarted }) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const stats = [
    { number: "10K+", label: "Profiles Created" },
    { number: "25K+", label: "Posts Shared" },
    { number: "15K+", label: "Notes with Tips" },
    { number: "24/7", label: "Uptime" }
  ];

  return (
    <section
      style={{
        padding: "80px 0 120px",
        position: "relative",
        overflow: "hidden",
        textAlign: "center"
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "300px",
          height: "300px",
          background: "var(--hero-gradient)",
          borderRadius: "50%",
          filter: "blur(120px)",
          opacity: 0.3,
          animation: "float 6s ease-in-out infinite"
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: "250px",
          height: "250px",
          background: "var(--primary-gradient)",
          borderRadius: "50%",
          filter: "blur(100px)",
          opacity: 0.2,
          animation: "float 8s ease-in-out infinite reverse"
        }}
      />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        {/* Main hero content */}
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(102, 126, 234, 0.1)",
              border: "1px solid rgba(102, 126, 234, 0.2)",
              borderRadius: "50px",
              marginBottom: "32px",
              backdropFilter: "blur(10px)"
            }}
          >
            <StarFilled style={{ color: "var(--secondary-color)" }} />
            <span
              style={{
                fontSize: "14px",
                fontWeight: "var(--font-weight-medium)",
                color: "var(--text-primary)"
              }}
            >
              New: Profile appearance customizations and ready-made templates
            </span>
            <CrownOutlined style={{ color: "var(--secondary-color)" }} />
          </div>

          {/* Main headline */}
          <Title
            level={1}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "var(--font-weight-extrabold)",
              lineHeight: "1.1",
              margin: "0 0 24px 0",
              background: "var(--hero-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.02em"
            }}
          >
            Create Your Digital Identity
            <br />
            <span
              style={{
                position: "relative",
                display: "inline-block"
              }}
            >
              Own It Forever
              <svg
                style={{
                  position: "absolute",
                  bottom: "-8px",
                  left: "0",
                  width: "100%",
                  height: "12px"
                }}
                viewBox="0 0 300 12"
                fill="none"
              >
                <path
                  d="M0 6C75 2, 150 2, 225 6C262.5 8, 337.5 8, 375 6"
                  stroke="var(--secondary-color)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.7"
                />
              </svg>
            </span>
          </Title>

          {/* Subtitle */}
          <Paragraph
            style={{
              fontSize: "1.25rem",
              color: "var(--text-secondary)",
              lineHeight: "1.6",
              marginBottom: "40px",
              maxWidth: "600px",
              margin: "0 auto 40px"
            }}
          >
            Build your professional profile as a{" "}
            <strong style={{ color: "var(--primary-color)" }}>
              soulbound NFT
            </strong>{" "}
            with on-chain metadata. Share links, receive tips, and connect with
            your audience on the decentralized web.
          </Paragraph>

          {/* CTA Buttons */}
          <Space size="large" style={{ marginBottom: "60px" }}>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={onGetStarted}
              style={{
                height: "52px",
                padding: "0 32px",
                fontSize: "16px",
                fontWeight: "var(--font-weight-semibold)",
                borderRadius: "26px",
                boxShadow: "var(--shadow-colored)",
                border: "none"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "var(--shadow-2xl)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "var(--shadow-colored)";
              }}
            >
              Create Your LinkFolio
              <ArrowRightOutlined />
            </Button>

            <Button
              size="large"
              icon={<PlayCircleOutlined />}
              style={{
                height: "52px",
                padding: "0 24px",
                fontSize: "16px",
                fontWeight: "var(--font-weight-medium)",
                borderRadius: "26px",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "var(--text-primary)"
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              Watch Demo
            </Button>
            <Link href="/explore">
              <Button
                size="large"
                icon={<CompassOutlined />}
                style={{
                  height: "52px",
                  padding: "0 24px",
                  fontSize: "16px",
                  fontWeight: "var(--font-weight-medium)",
                  borderRadius: "26px",
                  background: "rgba(102, 126, 234, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(102, 126, 234, 0.3)",
                  color: "var(--primary-color)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.2)";
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(102, 126, 234, 0.1)";
                  e.target.style.transform = "translateY(0)";
                  e.target.style.borderColor = "rgba(102, 126, 234, 0.3)";
                }}
              >
                Explore Profiles
              </Button>
            </Link>
          </Space>

          {/* Demo video placeholder */}
          <div
            style={{
              position: "relative",
              maxWidth: "700px",
              margin: "0 auto 60px",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "var(--shadow-2xl)",
              background: "var(--surface)",
              border: "1px solid var(--border-color)"
            }}
          >
            <div
              style={{
                aspectRatio: "16/9",
                background:
                  "linear-gradient(135deg, var(--surface-secondary) 0%, var(--surface) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all var(--transition-normal)"
              }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
              }}
            >
              {!isVideoPlaying ? (
                <div style={{ textAlign: "center" }}>
                  <PlayCircleOutlined
                    style={{
                      fontSize: "64px",
                      color: "var(--primary-color)",
                      marginBottom: "16px",
                      display: "block"
                    }}
                  />
                  <Title level={4} style={{ margin: 0 }}>
                    See LinkFolio in Action
                  </Title>
                  <Paragraph style={{ margin: "8px 0 0", opacity: 0.7 }}>
                    3 minute demo
                  </Paragraph>
                </div>
              ) : (
                <Title level={4} style={{ margin: 0 }}>
                  🎬 Demo Video Playing...
                </Title>
              )}
            </div>
          </div>
        </div>

        {/* Stats section */}
        <Row gutter={[32, 16]} justify="center">
          {stats.map((stat, index) => (
            <Col key={index} xs={12} sm={6}>
              <div
                style={{
                  textAlign: "center",
                  padding: "20px",
                  background: "rgba(255, 255, 255, 0.05)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all var(--transition-normal)"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                  e.target.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "rgba(255, 255, 255, 0.05)";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <Title
                  level={2}
                  style={{
                    margin: "0 0 8px 0",
                    background: "var(--text-gradient)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontWeight: "var(--font-weight-bold)"
                  }}
                >
                  {stat.number}
                </Title>
                <Paragraph
                  style={{
                    margin: 0,
                    color: "var(--text-secondary)",
                    fontSize: "14px",
                    fontWeight: "var(--font-weight-medium)"
                  }}
                >
                  {stat.label}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* Floating elements */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          fontSize: "24px",
          opacity: 0.3,
          animation: "float 4s ease-in-out infinite"
        }}
      >
        🚀
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "5%",
          fontSize: "32px",
          opacity: 0.2,
          animation: "float 5s ease-in-out infinite reverse"
        }}
      >
        ⚡
      </div>
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "15%",
          fontSize: "20px",
          opacity: 0.25,
          animation: "float 3s ease-in-out infinite"
        }}
      >
        ✨
      </div>
    </section>
  );
}
