import { Breadcrumb as AntBreadcrumb } from "antd";

function Breadcrumb() {
  return (
    <AntBreadcrumb
      className="mb-4"
      items={[
        {
          title: "Home",
        },
        {
          title: <a href="">Application Center</a>,
        },
        {
          title: <a href="">Application List</a>,
        },
        {
          title: "An Application",
        },
      ]}
    />
  );
}

export default Breadcrumb;
