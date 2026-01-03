import { Breadcrumb, Button, Layout, Menu, theme } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import ClerkAvatar from "./ClerkAvatar";
import { Header as AntHeader } from "antd/es/layout/layout";

function Header({ collapsed, setCollapsed }) {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <AntHeader
      style={{ background: colorBgContainer }}
      className={`flex justify-between p-0`}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
      <ClerkAvatar />
    </AntHeader>
  );
}

export default Header;
