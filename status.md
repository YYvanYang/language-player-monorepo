好的，这是本次为解决 Server Component 访问后端认证接口（`GET /users/me/collections`）出现的 `401 UNAUTHENTICATED` 错误而进行的修改总结。

**核心问题:**

后端 API 路由 `/api/v1/users/me/collections` 需要 JWT Bearer Token 进行认证，但前端 `user-app` 的 Server Component 在发起请求时，仅能自动发送 `iron-session` 的会话 Cookie，无法发送 JWT Access Token，导致被后端 `Authenticator` 中间件拒绝。

**解决方案：Backend-for-Frontend (BFF) API 代理路由**

在 `user-app` 中创建一个 API 路由 (`/api/proxy/[...path]`) 作为 BFF 代理。这个代理负责：

1.  验证当前用户的 `iron-session` 会话 Cookie。
2.  从会话数据中解密（之前已加密存储的）JWT Access Token。
3.  将原始请求（方法、路径、查询参数、请求体）转发给实际的 Go 后端 API。
4.  在转发时，将解密后的 Access Token 添加到 `Authorization: Bearer <token>` 请求头中。
5.  将 Go 后端的响应（状态码、头、响应体）流式传输回给调用方（Server Component/Action）。

**代码修改详情:**

1.  **后端 (Go API - `language-learning-player-api`)**:
    *   **`internal/port/usecase.go`**: 在 `AudioContentUseCase` 接口中添加了 `ListUserCollections` 方法签名。
    *   **`internal/port/params.go`**: 添加了 `ListUserCollectionsParams` 结构体，用于传递用户 ID、分页和排序参数给 Use Case。
    *   **`internal/usecase/audio_content_uc.go`**: 实现了 `ListUserCollections` 方法，内部调用 `collectionRepo.ListByOwner`。调整了 `GetCollectionDetails` 和 `GetCollectionTracks` 的权限检查逻辑，确保先检查权限再获取数据。调整了 `UpdateCollectionMetadata`, `UpdateCollectionTracks`, `DeleteCollection` 的权限检查方式（依赖 Repository 或在 Use Case 中先 `FindByID` 检查 `OwnerID`）。
    *   **`internal/adapter/handler/http/audio_handler.go`**:
        *   添加了新的处理器方法 `ListMyCollections`，用于处理 `GET /users/me/collections` 请求。
        *   该方法从 context 获取用户 ID，解析查询参数，调用 `audioUseCase.ListUserCollections`，并将结果映射为分页 DTO 返回。
        *   为 `ListMyCollections` 添加了 Swagger 注解。
    *   **`cmd/api/main.go`**:
        *   在受保护的路由组 (`r.Group(func(r chi.Router) { r.Use(middleware.Authenticator(secHelper)) ... })`) 中添加了新路由 `r.Get("/users/me/collections", audioHandler.ListMyCollections)`。
        *   微调了 `/users/me` 下的路由组织结构。

2.  **前端 - 共享包 (`packages/`)**:
    *   **`packages/auth/src/session.ts`**:
        *   在 `SessionData` 接口中添加了 `encryptedAccessToken?: string;` 字段，用于存储加密后的 JWT Access Token。
        *   更新了 `getUserSessionOptions` 和 `getAdminSessionOptions` 中的安全警告，确保密钥配置正确且不同。
    *   **`packages/api-client/src/index.ts`**:
        *   **移除了**可选的 `token` 参数，因为认证现在由 BFF 代理处理。
        *   修改了 `credentials` 选项，使其默认为 `'include'`，以便在调用代理或直接调用后端（如果是公共路由）时都能发送必要的 cookie。
        *   更新了便捷方法 (`apiGet`, `apiPost` 等) 以移除 `token` 参数。
    *   **(无需修改)** `packages/types/src/index.ts`: DTO 定义保持不变。
    *   **(无需修改)** `packages/utils/src/index.ts`: 工具函数保持不变。

3.  **前端 - 用户应用 (`apps/user-app/`)**:
    *   **新增 `apps/user-app/_lib/server-utils.ts`**:
        *   添加了 `encryptToken` 和 `decryptToken` 函数（**注意：包含的是需要替换的加密/解密伪代码/示例，需要安全实现**）。
        *   添加了 `getEncryptionKey` 辅助函数，用于从环境变量派生加密密钥（**需要设置 `ACCESS_TOKEN_ENCRYPTION_KEY` 和 `ACCESS_TOKEN_ENCRYPTION_SALT` 环境变量**）。
    *   **`apps/user-app/_actions/authActions.ts`**:
        *   修改了 `setUserSessionCookie` 辅助函数，使其在保存 session 时调用 `encryptToken` 加密 `accessToken` 并存入 `session.encryptedAccessToken`。
        *   更新了 `loginAction`, `registerAction`, `googleCallbackAction`，确保在调用 `setUserSessionCookie` 时传递从后端获取的 `accessToken`。
        *   `logoutAction` 保持不变（只清除前端 session）。
        *   `refreshSessionAction` 保持为需要进一步实现的占位符。
    *   **新增 `apps/user-app/app/api/proxy/[...path]/route.ts`**:
        *   实现了 BFF 代理路由，处理 GET, POST, PUT, DELETE, PATCH 方法。
        *   该路由验证 `iron-session`，调用 `decryptToken` 获取 Access Token。
        *   构造新的请求头，添加 `Authorization: Bearer <token>`，移除 `cookie` 和 Next.js/Vercel 特定头。
        *   使用 `fetch` 将请求转发到 `NEXT_PUBLIC_API_BASE_URL` 指定的后端 API。
        *   流式返回后端响应。
    *   **`apps/user-app/_services/collectionService.ts`**:
        *   修改了 `listMyCollections`, `getCollectionDetailsWithTracks`, `getTracksForCollection` 函数。
        *   将请求的 `endpoint` 指向 BFF 代理路径 (e.g., `/api/proxy/users/me/collections`)。
        *   **移除了**传递给 `apiClient` 的 `token` 参数。
    *   **`apps/user-app/app/(main)/collections/page.tsx`**:
        *   修改了 `CollectionsContent` Server Component。
        *   **移除了**直接读取 session 和解密 token 的逻辑。
        *   现在直接调用（已修改的）`listMyCollections` 服务函数，该函数内部会请求 BFF 代理。
        *   保留了对 `session.userId` 的检查，以决定是否显示登录提示或尝试获取数据。
        *   添加了对 `APIError` 401 错误的特定处理，提示用户重新登录。
    *   **(可能需要修改)** 其他调用受保护端点的 Service 函数 (如 `userService.ts`, `trackService.ts` 中的部分函数) 和调用这些函数的 Server Component/Action，都需要改为通过 `/api/proxy/...` 路径访问，并移除显式传递 token 的逻辑。

**关键要点:**

*   **认证流程**: 用户登录/注册 -> 后端返回 Access/Refresh Token -> Server Action 加密 Access Token 并与 UserID 一起存入 Session Cookie -> Server Component/Action 需要访问保护接口 -> 调用 Service 函数 -> Service 函数请求 BFF 代理 (`/api/proxy/...`) -> BFF 代理读取 Session Cookie, 解密 Token -> BFF 代理携带 Bearer Token 请求后端 API -> 后端验证 Bearer Token。
*   **安全性**: 必须安全实现 `encryptToken`/`decryptToken` 并妥善管理 `ACCESS_TOKEN_ENCRYPTION_KEY` 和 `ACCESS_TOKEN_ENCRYPTION_SALT` 环境变量。
*   **解耦**: Go 后端无需关心前端的 Session 实现（`iron-session`），保持标准的 JWT Bearer Token 认证。
*   **前端复杂度**: 主要的复杂性转移到了前端，包括加密/解密和 BFF 代理的实现。

这份总结提供了修改的依据和详细步骤，方便您后续参考或更新类似需要 Server Component 访问认证接口的模块。