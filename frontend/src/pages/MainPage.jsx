import { theme } from "antd";

function MainPage() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <div
      style={{
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
      }}
      className={`p-6 min-h-90 h-full`}
    >
      Bill is a cat.
    </div>
  );
}

export default MainPage;
