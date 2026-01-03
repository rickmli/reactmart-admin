import { Footer as AntFooter } from "antd/es/layout/layout";

function Footer() {
  return (
    <AntFooter className="bg-red-500 text-center">
      Ant Design ©{new Date().getFullYear()} Created by Ant UED
    </AntFooter>
  );
}

export default Footer;
