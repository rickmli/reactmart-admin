import { Content } from "antd/es/layout/layout";
import Breadcrumb from "./Breadcrumb";
import MainPage from "../pages/MainPage";

function MainContent({ children }) {
  return (
    <Content className="mx-4 grid grid-rows-[auto_1fr] py-4">
      <Breadcrumb />
      {/* <MainPage /> */}
      {children}
    </Content>
  );
}

export default MainContent;
