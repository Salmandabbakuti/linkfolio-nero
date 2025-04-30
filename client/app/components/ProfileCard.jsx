import { Avatar, Divider, Descriptions } from "antd";
import { LinkOutlined } from "@ant-design/icons";
import { supportedSocials } from "@/app/utils";

export default function ProfileCard({ profile }) {
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
      <Divider orientation="center" plain />
      <Descriptions column={2} colon={false} items={items} />
    </div>
  );
}
