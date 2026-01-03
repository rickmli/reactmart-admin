import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { StyleProvider } from "@ant-design/cssinjs";
import { BrowserRouter } from "react-router"; // 注意：是 react-router-dom 不是 react-router

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* 路由在最外层 */}
      <StyleProvider layer>
        {/* Ant Design 的样式层 */}
        <ClerkProvider
          publishableKey={PUBLISHABLE_KEY}
          appearance={{
            cssLayerName: "clerk", // Clerk 的 CSS 层
          }}
        >
          <App /> {/* 你的应用 */}
        </ClerkProvider>
      </StyleProvider>
    </BrowserRouter>
  </StrictMode>
);
