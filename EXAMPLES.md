# Examples

## Basic Usage

```typescript
import { TrioChatNotificationClient } from '@triochat/trio-push';

// Initialize the client
const client = new TrioChatNotificationClient({
  token: 'your-jwt-token',
  baseUrl: 'https://api.triochat.com',
});

// Example 1: Register a device
async function example1() {
  const response = await client.registerDevice({
    fcm_token: 'device-fcm-token-from-firebase',
    platform: 'ios',
    metadata: {
      app_version: '1.0.0',
      device_model: 'iPhone 14',
    }
  });
  console.log('Device registered:', response);
}

// Example 2: Get all devices
async function example2() {
  const response = await client.getDevices();
  console.log(`Total devices: ${response.total}`);
  response.devices.forEach(device => {
    console.log(`- ${device.platform} device: ${device.id}`);
  });
}

// Example 3: Send notification to specific devices
async function example3() {
  const response = await client.sendNotification({
    device_ids: ['device-id-1', 'device-id-2'],
    notification: {
      title: 'New Message',
      body: 'You have a new message from John'
    },
    data: {
      action: 'open_chat',
      chat_id: '123',
      message_id: '456'
    }
  });
  console.log(`Success: ${response.success_count}, Failed: ${response.failure_count}`);
}

// Example 4: Broadcast to all devices
async function example4() {
  await client.sendNotification({
    notification: {
      title: 'System Announcement',
      body: 'New features available!'
    }
  });
}
```

## With Error Handling

```typescript
import { TrioChatNotificationClient, TrioPushError } from '@triochat/trio-push';

const client = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN!,
  maxRetries: 5,
  retryDelay: 2000,
});

async function sendNotificationSafely(deviceIds: string[], title: string, body: string) {
  try {
    const response = await client.sendNotification({
      device_ids: deviceIds,
      notification: { title, body }
    });
    
    if (response.success_count > 0) {
      console.log(`✓ Notification sent to ${response.success_count} devices`);
    }
    
    if (response.failure_count > 0) {
      console.warn(`✗ Failed to send to ${response.failure_count} devices`);
      response.results?.forEach(result => {
        if (!result.success) {
          console.error(`  Device ${result.device_id}: ${result.error}`);
        }
      });
    }
    
    return response;
  } catch (error) {
    if (error instanceof TrioPushError) {
      console.error(`API Error [${error.statusCode}]: ${error.message}`);
      if (error.response) {
        console.error('Response:', error.response);
      }
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}
```

## React Native Integration

```typescript
import { TrioChatNotificationClient } from '@triochat/trio-push';
import messaging from '@react-native-firebase/messaging';

const client = new TrioChatNotificationClient({
  token: 'your-jwt-token',
});

// Register device when user logs in
async function registerDevice() {
  // Request permission
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (!enabled) {
    console.log('Push notification permission denied');
    return;
  }

  // Get FCM token
  const fcmToken = await messaging().getToken();
  
  // Register with Trio Push
  await client.registerDevice({
    fcm_token: fcmToken,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
    metadata: {
      app_version: DeviceInfo.getVersion(),
      device_model: DeviceInfo.getModel(),
    }
  });
  
  console.log('Device registered successfully');
}

// Handle token refresh
messaging().onTokenRefresh(async (token) => {
  await client.registerDevice({
    fcm_token: token,
    platform: Platform.OS === 'ios' ? 'ios' : 'android',
  });
});
```

## Express.js Backend Integration

```typescript
import express from 'express';
import { TrioChatNotificationClient } from '@triochat/trio-push';

const app = express();
app.use(express.json());

const notificationClient = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN!,
});

// Endpoint to register user's device
app.post('/api/devices/register', async (req, res) => {
  try {
    const { fcm_token, platform, metadata } = req.body;
    
    const response = await notificationClient.registerDevice({
      fcm_token,
      platform,
      metadata,
    });
    
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Endpoint to send notification
app.post('/api/notifications/send', async (req, res) => {
  try {
    const { user_ids, title, body, data } = req.body;
    
    // Get devices for these users
    const { devices } = await notificationClient.getDevices();
    const targetDevices = devices
      .filter(device => user_ids.includes(device.user_id))
      .map(device => device.id);
    
    const response = await notificationClient.sendNotification({
      device_ids: targetDevices,
      notification: { title, body },
      data,
    });
    
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

## Next.js API Route

```typescript
// pages/api/notifications/send.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { TrioChatNotificationClient } from '@triochat/trio-push';

const client = new TrioChatNotificationClient({
  token: process.env.TRIO_PUSH_TOKEN!,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { device_ids, title, body, data } = req.body;

    const response = await client.sendNotification({
      device_ids,
      notification: { title, body },
      data,
    });

    res.status(200).json(response);
  } catch (error) {
    console.error('Failed to send notification:', error);
    res.status(500).json({ error: 'Failed to send notification' });
  }
}
```

## TypeScript Types

```typescript
import type {
  TrioChatNotificationClientConfig,
  RegisterDeviceDto,
  SendNotificationDto,
  NotificationPayloadDto,
  Device,
  GetDevicesResponse,
  RegisterDeviceResponse,
  SendNotificationResponse,
} from '@triochat/trio-push';

// Type-safe configuration
const config: TrioChatNotificationClientConfig = {
  token: 'your-token',
  timeout: 60000,
  maxRetries: 5,
};

// Type-safe device registration
const deviceData: RegisterDeviceDto = {
  fcm_token: 'token',
  platform: 'ios',
  metadata: {
    custom_field: 'value',
  },
};

// Type-safe notification
const notification: SendNotificationDto = {
  device_ids: ['id1', 'id2'],
  notification: {
    title: 'Title',
    body: 'Body',
  },
  data: {
    action: 'open',
  },
};
```
