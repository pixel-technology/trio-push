<div align="center">

# 🔔 @triochat/trio-push

**The official JavaScript/TypeScript SDK for TrioChat Push Notifications**

[![npm version](https://img.shields.io/npm/v/@triochat/trio-push.svg?style=flat-square)](https://www.npmjs.com/package/@triochat/trio-push)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)](https://nodejs.org/)

Send push notifications, manage devices, and integrate with TrioChat — all with zero dependencies.

[📦 NPM](https://www.npmjs.com/package/@triochat/trio-push) · [📖 Docs](https://docs.triochat.com) · [🐛 Issues](https://github.com/triochat/trio-push-sdk/issues) · [✉️ Support](mailto:support@triochat.com)

</div>

---

## ✨ Features

- 🚀 **Zero dependencies** — built on native `fetch`, nothing else to install
- 🔒 **TypeScript first** — full type definitions out of the box
- 📱 **Multi-platform** — iOS, Android, and Web support
- ⚡ **Simple API** — register devices and fire notifications in minutes
- 🌐 **Universal** — runs in React Native, browsers, and Node.js

---

## 📦 Installation

```bash
# npm
npm install @triochat/trio-push

# yarn
yarn add @triochat/trio-push

# pnpm
pnpm add @triochat/trio-push
```

> **Note:** No peer dependencies required. The SDK uses native `fetch`, available in Node.js 18+, React Native, Bun, Deno, and all modern browsers.

---

## 🗺️ How It Works

This SDK is designed to be used across **two separate environments** in your stack:

| Method               |    Environment    | Purpose                                                        |
| -------------------- | :---------------: | -------------------------------------------------------------- |
| `registerDevice()`   | 📱 **Client app** | Called when the user opens the app to register their FCM token |
| `getDevices()`       |  🖥️ **Backend**   | Fetch registered devices to decide who to notify               |
| `sendNotification()` |  🖥️ **Backend**   | Trigger push notifications from your server                    |

---

## ⚙️ Configuration

```typescript
new TrioChatNotificationClient(config: TrioChatNotificationClientConfig)
```

| Option  | Type     | Required | Default | Description                                                                 |
| ------- | -------- | :------: | ------- | --------------------------------------------------------------------------- |
| `token` | `string` |    ✅    | —       | API token generated from the [TrioChat Dashboard](https://app.triochat.io/) |

> 🔑 **Get your token** — log in to [app.triochat.io](https://app.triochat.io/), navigate to your workspace settings, and generate an API token. Treat it like a password — never commit it to source control.

---

## 📱 Client App Usage

> Use this in your **React Native**, mobile, or web frontend to register the user's device when the app launches.

```typescript
import { TrioChatNotificationClient } from "@triochat/trio-push";

const client = new TrioChatNotificationClient({
  token: "your-api-token", // 👉 Generate at https://app.triochat.io/
});

// Call this after getting the FCM token from Firebase
await client.registerDevice({
  fcm_token: "firebase-device-token",
  platform: "ios", // 'ios' | 'android' | 'web'
  metadata: { app_version: "1.0.0" },
});
```

### React Native Example

```typescript
import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { TrioChatNotificationClient } from "@triochat/trio-push";

const client = new TrioChatNotificationClient({
  token: userAuthToken, // 👉 Token generated from https://app.triochat.io/
});

async function registerDeviceForPush() {
  // Request permission (iOS)
  await messaging().requestPermission();

  // Get the FCM token from Firebase
  const fcmToken = await messaging().getToken();

  // Register it with TrioChat
  const response = await client.registerDevice({
    fcm_token: fcmToken,
    platform: Platform.OS === "ios" ? "ios" : "android",
    metadata: {
      app_version: "2.0.0",
      device_model: DeviceInfo.getModel(),
    },
  });

  console.log("✅ Device registered:", response.device_id);
}

// Call on app startup / after login
useEffect(() => {
  registerDeviceForPush();
}, []);
```

### Web App Example

```typescript
import { getToken } from "firebase/messaging";
import { TrioChatNotificationClient } from "@triochat/trio-push";

const client = new TrioChatNotificationClient({
  token: userAuthToken, // 👉 Token generated from https://app.triochat.io/
});

async function registerWebDevice() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const fcmToken = await getToken(messaging, {
    vapidKey: "your-vapid-key",
  });

  await client.registerDevice({
    fcm_token: fcmToken,
    platform: "web",
    metadata: { browser: navigator.userAgent },
  });

  console.log("✅ Web device registered");
}
```

---

## 🖥️ Backend Usage (Node.js)

> Use this in your **server** to fetch devices and send notifications. Keep your token server-side only — never expose it in client app bundles.

```typescript
import { TrioChatNotificationClient } from "@triochat/trio-push";

const client = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN!, // 👉 Generate at https://app.triochat.io/
});
```

### Get All Devices

```typescript
const { devices, total } = await client.getDevices();

console.log(`📊 Total registered devices: ${total}`);

devices.forEach((device) => {
  console.log(`[${device.platform}] ${device.id} — user: ${device.user_id}`);
});
```

**Device shape:**

```typescript
interface Device {
  id: string;
  fcm_token: string;
  platform: "ios" | "android" | "web";
  metadata?: Record<string, any>;
  workspace_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
```

### Send a Notification

```typescript
// 🎯 Send to specific devices
const response = await client.sendNotification({
  device_ids: ["device-123", "device-456"],
  notification: {
    title: "💬 New Message",
    body: "John sent you a file",
  },
  data: {
    action: "open_chat",
    chat_id: "789",
  },
});

console.log(`✅ Delivered: ${response.success_count}`);
console.log(`❌ Failed:    ${response.failure_count}`);

// 📢 Broadcast to ALL devices in the workspace (omit device_ids)
await client.sendNotification({
  notification: {
    title: "📢 Announcement",
    body: "Scheduled maintenance tonight at 2 AM",
  },
});
```

### Update the Auth Token

```typescript
// Rotate your token when it refreshes
client.setToken("new-jwt-token");
```

---

## 📖 Full API Reference

### `registerDevice(data)` — 📱 Client

| Field       | Type                          | Required | Description                               |
| ----------- | ----------------------------- | :------: | ----------------------------------------- |
| `fcm_token` | `string`                      |    ✅    | FCM token from Firebase                   |
| `platform`  | `'ios' \| 'android' \| 'web'` |    ✅    | Device platform                           |
| `metadata`  | `Record<string, any>`         |    ❌    | Any extra info (app version, model, etc.) |

**Returns:** `{ message: string, device_id?: string }`

---

### `getDevices()` — 🖥️ Backend

**Returns:** `{ devices: Device[], total: number }`

---

### `sendNotification(data)` — 🖥️ Backend

| Field                | Type                  | Required | Description                              |
| -------------------- | --------------------- | :------: | ---------------------------------------- |
| `device_ids`         | `string[]`            |    ❌    | Target devices. Omit to broadcast to all |
| `notification.title` | `string`              |    ✅    | Notification title                       |
| `notification.body`  | `string`              |    ✅    | Notification body                        |
| `data`               | `Record<string, any>` |    ❌    | Custom payload passed through to the app |

**Returns:** `{ message: string, success_count: number, failure_count: number, results?: [...] }`

---

### `setToken(token)` — Both environments

```typescript
client.setToken("new-jwt-token");
```

---

## 🛡️ Error Handling

All failures throw a `TrioPushError`:

```typescript
import { TrioPushError } from '@triochat/trio-push';

try {
  await client.sendNotification({ ... });
} catch (error) {
  if (error instanceof TrioPushError) {
    console.error('❌ Status:',   error.statusCode);  // e.g. 401, 404
    console.error('💬 Message:',  error.message);
    console.error('📦 Response:', error.response);
  }
}
```

| Property        | Type                  | Description                            |
| --------------- | --------------------- | -------------------------------------- |
| `message`       | `string`              | Human-readable error description       |
| `statusCode`    | `number \| undefined` | HTTP status code                       |
| `response`      | `any`                 | Raw response body from the API         |
| `originalError` | `Error \| undefined`  | Underlying network error if applicable |

---

## 💡 More Examples

### 🔔 Notify a User Across All Their Devices

```typescript
// Backend: look up all devices for a user then ping them all
async function notifyUser(userId: string, title: string, body: string) {
  const { devices } = await client.getDevices();

  const userDeviceIds = devices
    .filter((d) => d.user_id === userId)
    .map((d) => d.id);

  if (userDeviceIds.length === 0) {
    console.log("⚠️  No devices found for user");
    return;
  }

  const response = await client.sendNotification({
    device_ids: userDeviceIds,
    notification: { title, body },
  });

  console.log(
    `✅ Notified user ${userId} on ${response.success_count} device(s)`,
  );
}
```

### 🍎 Target a Specific Platform

```typescript
async function notifyIOSUsers(title: string, body: string) {
  const { devices } = await client.getDevices();

  const iosDeviceIds = devices
    .filter((d) => d.platform === "ios")
    .map((d) => d.id);

  await client.sendNotification({
    device_ids: iosDeviceIds,
    notification: { title, body },
    data: { deep_link: "myapp://home" },
  });

  console.log(`🍎 Sent to ${iosDeviceIds.length} iOS device(s)`);
}
```

### 💬 New Chat Message Notification

```typescript
// Trigger this from your message handler on the backend
async function onNewMessage(
  chatId: string,
  senderName: string,
  recipientDeviceIds: string[],
) {
  const response = await client.sendNotification({
    device_ids: recipientDeviceIds,
    notification: {
      title: `💬 ${senderName}`,
      body: "Sent you a new message",
    },
    data: {
      action: "open_chat",
      chat_id: chatId,
    },
  });

  if (response.failure_count > 0) {
    console.warn(`⚠️ ${response.failure_count} notification(s) failed`);
    response.results
      ?.filter((r) => !r.success)
      .forEach((r) => console.error(`  ↳ ${r.device_id}: ${r.error}`));
  }
}
```

### 📢 Broadcast Announcement

```typescript
await client.sendNotification({
  // No device_ids = send to ALL devices in the workspace
  notification: {
    title: "🚀 New Feature",
    body: "Check out what's new in v3.0",
  },
  data: { action: "open_changelog" },
});
```

---

## 🧩 TypeScript Support

Full types are exported and ready to use:

```typescript
import type {
  RegisterDeviceDto,
  SendNotificationDto,
  NotificationPayloadDto,
  Device,
  GetDevicesResponse,
  SendNotificationResponse,
} from "@triochat/trio-push";

// Platform enum
import { RegisterDevicePlatformEnum } from "@triochat/trio-push";

await client.registerDevice({
  fcm_token: "token",
  platform: RegisterDevicePlatformEnum.platform.IOS,
});
```

---

## ✅ Best Practices

1. 🔑 **Keep backend tokens secret** — your token is generated from [app.triochat.io](https://app.triochat.io/) and should only ever live on your server via an env variable (e.g. `TRIO_PUSH_TOKEN`), never in client app bundles
2. 📱 **Register on every app launch** — FCM tokens can rotate, so always call `registerDevice` when the app starts or the user logs in
3. 🏷️ **Use metadata** — store `app_version`, `locale`, `device_model`, etc. to help with targeting and debugging
4. 📦 **Batch your sends** — always pass multiple `device_ids` in one call rather than looping
5. 🛡️ **Always handle errors** — wrap calls in `try/catch` and check `error instanceof TrioPushError`

---

## 📋 Requirements

| Requirement  | Version                            |
| ------------ | ---------------------------------- |
| Node.js      | 18+ _(backend / for native fetch)_ |
| React Native | 0.60+ _(client)_                   |
| TypeScript   | 4.5+ _(optional)_                  |

---

## 📄 License

MIT © [TrioChat](https://triochat.com)

---

<div align="center">

**Need help?** Open an [issue on GitHub](https://github.com/triochat/trio-push-sdk/issues) or email us at [support@triochat.com](mailto:support@triochat.com)

Made with ❤️ by the TrioChat team

</div>
# -triochat-trio-push
