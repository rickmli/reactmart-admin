import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";

function App() {
  // ✅ 正确：在组件顶层调用 Hooks
  const { user, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth(); // 在这里获取 getToken

  // 调试：在控制台打印所有信息
  const debugClerkInfo = () => {
    console.log("=== Clerk 调试信息 ===");
    console.log("用户对象:", user);
    console.log("是否已登录:", isSignedIn);
    console.log("Clerk 用户ID:", user?.id);
    console.log("邮箱:", user?.primaryEmailAddress?.emailAddress);
    console.log("公开元数据:", user?.publicMetadata);
    console.log("完整用户对象:", JSON.stringify(user, null, 2));
  };

  // ✅ 正确：在单独的函数中获取令牌
  const handleGetToken = async () => {
    try {
      const token = await getToken();
      if (token) {
        console.log("用于后端API的令牌:", token);
        console.log("令牌前50位:", token.substring(0, 50) + "...");

        // 可选：解码 JWT 查看内容
        // const payload = JSON.parse(atob(token.split(".")[1]));
        // console.log("令牌负载 (payload):", payload);
        const response = await fetch(
          // "http://localhost:5001/api/users/clerkInfo",
          // {
          //   method: "GET",
          //   headers: {
          //     Authorization: `Bearer ${token}`, // 🚨 关键：将令牌放在请求头
          //     "Content-Type": "application/json",
          //   },
          // }
          "http://localhost:5001/api/users/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`, // 🚨 关键：将令牌放在请求头
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log("创建结果:", result);
      } else {
        console.log("未获取到令牌，可能未登录");
      }
    } catch (error) {
      console.error("获取令牌失败:", error);
    }
  };

  const handleCheckRole = () => {
    console.log("公开元数据:", user?.publicMetadata);
    alert(`我的角色: ${user?.publicMetadata?.role || "未设置"}`);
  };

  const handleProductSearch = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:5001/api/products/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // 🚨 关键：将令牌放在请求头
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log("查询结果:", result);
    } catch (error) {
      console.error("获取令牌失败:", error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">
        Clerk 用户信息调试
      </h1>

      <header className="mb-8">
        <SignedOut>
          <div className="flex items-center gap-4">
            <SignInButton mode="modal" />
            <span className="text-gray-600">请先登录</span>
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton afterSignOutUrl="/" />
            <span className="text-green-600 font-medium">已登录</span>
          </div>
        </SignedIn>
      </header>

      {/* 调试信息区域 */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">用户信息</h2>

        {!authLoaded || !userLoaded ? (
          <p>加载中...</p>
        ) : isSignedIn ? (
          <div>
            <div className="mb-4">
              <p>
                <strong>Clerk 用户ID:</strong> {user.id}
              </p>
              <p>
                <strong>邮箱:</strong>{" "}
                {user.primaryEmailAddress?.emailAddress || "无"}
              </p>
              <p>
                <strong>用户名:</strong> {user.username || "未设置"}
              </p>
              <p>
                <strong>全名:</strong> {user.fullName || "未设置"}
              </p>
            </div>

            <button
              onClick={debugClerkInfo}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-3"
            >
              在控制台打印完整用户信息
            </button>

            {/* 显示令牌信息（用于API调用） */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">API 令牌信息</h3>
              <p className="text-sm text-gray-600">
                登录后，Clerk 会提供令牌用于调用你的后端 API。
                点击下面按钮获取令牌。
              </p>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">请先登录以查看用户信息</p>
        )}
      </div>

      {/* 快速操作示例 */}
      <SignedIn>
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3">快速操作示例</h3>
          <div className="flex gap-3">
            <button
              onClick={handleGetToken} // ✅ 使用预定义的函数
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              获取API令牌
            </button>

            <button
              onClick={handleCheckRole} // ✅ 使用预定义的函数
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              查看我的角色
            </button>

            <button
              onClick={handleProductSearch}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mr-3"
            >
              点击查询product;
            </button>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}

export default App;
