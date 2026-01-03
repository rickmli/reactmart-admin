import { theme } from "antd";
import { Content } from "antd/es/layout/layout";
import Breadcrumb from "./Breadcrumb";

function MainContent() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content className="mx-4 grid grid-rows-[auto_1fr] bg-yellow-300 py-4">
      <Breadcrumb />
      <div
        style={{
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
        className={`p-6 min-h-90 h-full`}
      >
        Bill is a cat.
      </div>
    </Content>
  );
}

export default MainContent;
