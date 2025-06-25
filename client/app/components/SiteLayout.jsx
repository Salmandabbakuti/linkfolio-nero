"use client";
import { Layout } from "antd";
import Link from "next/link";
import Footer from "./Footer";
import "antd/dist/reset.css";

const { Header, Content } = Layout;

export default function SiteLayout({ children }) {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "transparent"
      }}
    >
      <Header
        style={{
          position: "sticky",
          top: 8,
          zIndex: 1000,
          padding: "0 24px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderRadius: "16px",
          margin: "16px 16px 0",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "var(--shadow-lg)",
          transition: "all var(--transition-normal)"
        }}
      >
        <Link href="/">
          <h3
            style={{
              margin: 0,
              fontWeight: "var(--font-weight-bold)",
              background: "var(--text-gradient)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              fontSize: "1.5rem",
              letterSpacing: "-0.02em"
            }}
          >
            🔗 LinkFolio
          </h3>
        </Link>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px"
          }}
        >
          <appkit-button />
        </div>
      </Header>

      <Content
        style={{
          margin: "24px 16px 0",
          padding: 0,
          minHeight: "calc(100vh - 200px)",
          position: "relative"
        }}
      >
        <div className="container">{children}</div>
      </Content>

      <Footer />
    </Layout>
  );
}
