import {} from "@ant-design/icons";
import { Layout } from "antd";
import Header from "../components/Header";
import SideNav from "../components/SideNav";
import { useState } from "react";
import MainContent from "../components/MainContent";
import Footer from "../components/Footer";

function ProjectLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout className="h-screen">
      <SideNav collapsed={collapsed} setCollapsed={setCollapsed} />
      <Layout className="h-full flex flex-column bg-gray-400">
        <Header setCollapsed={setCollapsed} collapsed={collapsed} />
        <MainContent className="flex-1">{children}</MainContent>
        <Footer />
      </Layout>
    </Layout>
  );
}

export default ProjectLayout;
