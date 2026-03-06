# 1.0.0 (2026-03-06)
# Changelog

## 1.0.0 (2026-03-06)

### 🚀 Features

- Initial release of `@triochat/trio-push`
- `registerDevice()` — register iOS, Android, and Web devices via FCM token
- `getDevices()` — fetch all registered devices for a workspace
- `sendNotification()` — send push notifications to specific devices or broadcast to all
- `setToken()` — update the auth token at runtime
- Full TypeScript support with exported types
- Zero dependencies — built on native `fetch`, no axios required
- Works in React Native, browsers, and Node.js 18+