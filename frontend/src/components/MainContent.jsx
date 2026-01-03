import { Content } from "antd/es/layout/layout";
import Breadcrumb from "./Breadcrumb";

function MainContent({ children }) {
  return (
    <Content className="mx-4 grid grid-rows-[auto_1fr] bg-yellow-300 py-4">
      <Breadcrumb />
      {children}
    </Content>
  );
}

export default MainContent;
