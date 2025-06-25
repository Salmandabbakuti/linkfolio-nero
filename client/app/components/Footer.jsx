"use client";
import { Typography, Row, Col, Divider } from "antd";
import { TwitterOutlined, GithubOutlined, DiscordOutlined, MediumOutlined } from "@ant-design/icons";
import Link from "next/link";
import styles from "./Footer.module.css";

const { Title, Text, Paragraph } = Typography;

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Templates", href: "#templates" },
      { label: "Pricing", href: "/pricing" },
      { label: "Roadmap", href: "/roadmap" }
    ],
    resources: [
      { label: "Documentation", href: "/docs" },
      { label: "API Reference", href: "/api" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "Blog", href: "/blog" }
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      { label: "Press Kit", href: "/press" }
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "DMCA", href: "/dmca" }
    ]
  };

  return (
    <footer className={styles.footerSection}>
      <div className={styles.footerGradient} />
      
      <div className={`container ${styles.footerContainer}`}>
        {/* Brand Section */}
        <div className={styles.footerBrand}>
          <Title level={2} className={styles.footerLogo}>
            🔗 LinkFolio
          </Title>
          <Paragraph className={styles.footerTagline}>
            Create your digital identity as a soulbound NFT. Own your profile forever with on-chain metadata.
          </Paragraph>
        </div>

        {/* Links Section */}
        <Row gutter={[32, 32]} className={styles.footerLinks}>
          <Col xs={12} sm={6}>
            <div className={styles.footerLinkGroup}>
              <h4>Product</h4>
              {footerLinks.product.map((link, index) => (
                <Link key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>
          
          <Col xs={12} sm={6}>
            <div className={styles.footerLinkGroup}>
              <h4>Resources</h4>
              {footerLinks.resources.map((link, index) => (
                <Link key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>
          
          <Col xs={12} sm={6}>
            <div className={styles.footerLinkGroup}>
              <h4>Company</h4>
              {footerLinks.company.map((link, index) => (
                <Link key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>
          
          <Col xs={12} sm={6}>
            <div className={styles.footerLinkGroup}>
              <h4>Legal</h4>
              {footerLinks.legal.map((link, index) => (
                <Link key={index} href={link.href} className={styles.footerLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </Col>
        </Row>

        <Divider className={styles.footerDivider} />

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <Text className={styles.footerCopyright}>
            © {currentYear} LinkFolio. All rights reserved. Built on NERO Chain.
          </Text>
          
          <div className={styles.socialLinks}>
            <a href="https://twitter.com/linkfolio" className={styles.socialLink} aria-label="Twitter">
              <TwitterOutlined />
            </a>
            <a href="https://github.com/linkfolio" className={styles.socialLink} aria-label="GitHub">
              <GithubOutlined />
            </a>
            <a href="https://discord.gg/linkfolio" className={styles.socialLink} aria-label="Discord">
              <DiscordOutlined />
            </a>
            <a href="https://medium.com/@linkfolio" className={styles.socialLink} aria-label="Medium">
              <MediumOutlined />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
