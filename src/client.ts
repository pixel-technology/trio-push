import type { RegisterDeviceDto } from "./generated/models/RegisterDeviceDto";
import type { SendNotificationDto } from "./generated/models/SendNotificationDto";
import type { NotificationPayloadDto } from "./generated/models/NotificationPayloadDto";

// ─────────────────────────────────────────────
// Firebase Messaging Types (from firebase-admin)
// ─────────────────────────────────────────────

export interface AndroidConfig {
  collapseKey?: string;
  priority?: "high" | "normal";
  ttl?: number;
  restrictedPackageName?: string;
  data?: { [key: string]: string };
  notification?: AndroidNotification;
  fcmOptions?: AndroidFcmOptions;
  directBootOk?: boolean;
}

export interface AndroidNotification {
  title?: string;
  body?: string;
  icon?: string;
  color?: string;
  sound?: string;
  tag?: string;
  imageUrl?: string;
  clickAction?: string;
  bodyLocKey?: string;
  bodyLocArgs?: string[];
  titleLocKey?: string;
  titleLocArgs?: string[];
  channelId?: string;
  ticker?: string;
  sticky?: boolean;
  eventTimestamp?: Date;
  localOnly?: boolean;
  priority?: "min" | "low" | "default" | "high" | "max";
  vibrateTimingsMillis?: number[];
  defaultVibrateTimings?: boolean;
  defaultSound?: boolean;
  lightSettings?: LightSettings;
  defaultLightSettings?: boolean;
  visibility?: "private" | "public" | "secret";
  notificationCount?: number;
  proxy?: "allow" | "deny" | "if_priority_lowered";
}

export interface LightSettings {
  color: string;
  lightOnDurationMillis: number;
  lightOffDurationMillis: number;
}

export interface AndroidFcmOptions {
  analyticsLabel?: string;
}

export interface WebpushConfig {
  headers?: { [key: string]: string };
  data?: { [key: string]: string };
  notification?: WebpushNotification;
  fcmOptions?: WebpushFcmOptions;
}

export interface WebpushFcmOptions {
  link?: string;
}

export interface WebpushNotification {
  title?: string;
  actions?: Array<{
    action: string;
    icon?: string;
    title: string;
  }>;
  badge?: string;
  body?: string;
  data?: any;
  dir?: "auto" | "ltr" | "rtl";
  icon?: string;
  image?: string;
  lang?: string;
  renotify?: boolean;
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  timestamp?: number;
  vibrate?: number | number[];
  [key: string]: any;
}

export interface ApnsConfig {
  liveActivityToken?: string;
  headers?: { [key: string]: string };
  payload?: ApnsPayload;
  fcmOptions?: ApnsFcmOptions;
}

export interface ApnsPayload {
  aps: Aps;
  [customData: string]: any;
}

export interface Aps {
  alert?: string | ApsAlert;
  badge?: number;
  sound?: string | CriticalSound;
  contentAvailable?: boolean;
  mutableContent?: boolean;
  category?: string;
  threadId?: string;
  [customData: string]: any;
}

export interface ApsAlert {
  title?: string;
  subtitle?: string;
  body?: string;
  locKey?: string;
  locArgs?: string[];
  titleLocKey?: string;
  titleLocArgs?: string[];
  subtitleLocKey?: string;
  subtitleLocArgs?: string[];
  actionLocKey?: string;
  launchImage?: string;
}

export interface CriticalSound {
  critical?: boolean;
  name: string;
  volume?: number;
}

export interface ApnsFcmOptions {
  analyticsLabel?: string;
  imageUrl?: string;
}

export interface FcmOptions {
  analyticsLabel?: string;
}

// ─────────────────────────────────────────────
// API Response Wrapper
// ─────────────────────────────────────────────

interface ApiResponse<T> {
  payload: T;
  statusCode: number;
  error: null | string;
}

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

/**
 * Configuration options for TrioChatNotificationClient.
 * Pass this to the constructor when creating a new client instance.
 *
 * The target environment (production vs development) is automatically
 * inferred from the `is_dev` claim embedded in the JWT token itself.
 */
export interface TrioChatNotificationClientConfig {
  /**
   * JWT / API token for authentication.
   * Generate this from your workspace settings at https://app.triochat.io/
   * Keep this secret — never expose it in client-side bundles.
   *
   * The environment (dev/prod) is determined by the `is_dev` claim inside
   * the token — no separate flag is needed.
   */
  token: string;
}

// ─────────────────────────────────────────────
// Device
// ─────────────────────────────────────────────

/**
 * Represents a registered device returned from the TrioChat API.
 */
export interface Device {
  _id: string;
  device_id: string;
  fcm_token: string;
  platform: "ios" | "android" | "web";
  metadata?: Record<string, any>;
  workspace_id: string;
  createdAt: string;
  created_at: string;
  updatedAt: string;
  updated_at: string;
}

// ─────────────────────────────────────────────
// Response Types
// ─────────────────────────────────────────────

/**
 * Response returned after successfully registering a device.
 */
export interface RegisterDeviceResponse {
  success: boolean;
  device_id: string;
  workspace_id: string;
}

/**
 * Response returned after sending a push notification.
 */
export interface SendNotificationResponse {
  message: string;
  success_count: number;
  failure_count: number;
  results?: Array<{
    device_id: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * Enhanced SendNotificationDto with Firebase messaging config support.
 */
export interface SendNotificationRequest {
  /**
   * Array of device IDs to send the notification to.
   * Omit to broadcast to all devices in the workspace.
   */
  device_ids?: string[];

  /**
   * The notification payload with title and body.
   */
  notification: NotificationPayloadDto;

  /**
   * Custom data payload to include with the notification.
   */
  data?: Record<string, unknown>;

  /**
   * Android-specific configuration options.
   */
  android?: AndroidConfig;

  /**
   * Web push-specific configuration options.
   */
  webpush?: WebpushConfig;

  /**
   * APNs (iOS)-specific configuration options.
   */
  apns?: ApnsConfig;

  /**
   * FCM options (cross-platform).
   */
  fcmOptions?: FcmOptions;
}

// ─────────────────────────────────────────────
// Error Class
// ─────────────────────────────────────────────

/**
 * Custom error thrown by all TrioChatNotificationClient methods.
 *
 * @example
 * ```typescript
 * try {
 *   await client.sendNotification({ ... });
 * } catch (error) {
 *   if (error instanceof TrioPushError) {
 *     console.error(error.statusCode);
 *     console.error(error.message);
 *     console.error(error.response);
 *   }
 * }
 * ```
 */
export class TrioPushError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: any,
    public originalError?: Error,
  ) {
    super(message);
    this.name = "TrioPushError";
    Object.setPrototypeOf(this, TrioPushError.prototype);
  }
}

// ─────────────────────────────────────────────
// Main Client
// ─────────────────────────────────────────────

/**
 * Official client for the TrioChat Push Notification API.
 *
 * Supports all Firebase Cloud Messaging configuration options including
 * platform-specific settings for Android, iOS (APNs), and Web Push.
 *
 * The target environment (dev vs prod) is automatically resolved by
 * reading the `is_dev` claim from the JWT token — no extra config needed.
 *
 * @example
 * ```typescript
 * // Production token  → hits https://triochat-push.onrender.com
 * // Development token → hits https://triochat-push-dev.onrender.com
 * const client = new TrioChatNotificationClient({
 *   token: process.env.TRIO_PUSH_TOKEN!
 * });
 *
 * // Register a device
 * await client.registerDevice({
 *   fcm_token: 'firebase-token',
 *   platform: 'ios',
 *   metadata: { user_id: 'user-123' }
 * });
 *
 * // Send notification with platform-specific config
 * await client.sendNotification({
 *   device_ids: ['device-123'],
 *   notification: { title: 'Hello', body: 'World' },
 *   android: {
 *     priority: 'high',
 *     notification: {
 *       sound: 'default',
 *       channelId: 'default'
 *     }
 *   },
 *   apns: {
 *     payload: {
 *       aps: {
 *         sound: 'default',
 *         badge: 1
 *       }
 *     }
 *   }
 * });
 * ```
 */
export class TrioChatNotificationClient {
  private readonly baseUrl: string;
  private token: string;

  constructor(config: TrioChatNotificationClientConfig) {
    if (!config.token) {
      throw new TrioPushError("Token is required for authentication");
    }

    this.token = config.token;

    // Resolve environment from the `is_dev` claim inside the JWT payload
    const isDev = TrioChatNotificationClient.decodeTokenClaim(
      config.token,
      "is_dev",
    );

    this.baseUrl = isDev
      ? "https://triochat-push.onrender.com"
      : "https://triochat-backend-push.onrender.com";
  }

  // ─────────────────────────────────────────────
  // Private: JWT Decoder
  // ─────────────────────────────────────────────

  /**
   * Decodes a JWT payload (without verification) and returns the value
   * of the requested claim. Returns `false` if decoding fails for any reason.
   *
   * @param token - The raw JWT string
   * @param claim - The claim key to read from the payload
   */
  private static decodeTokenClaim(token: string, claim: string): boolean {
    try {
      const payloadBase64 = token.split(".")[1];
      if (!payloadBase64) return false;

      const json = Buffer.from(payloadBase64, "base64url").toString("utf8");
      const payload = JSON.parse(json);

      return Boolean(payload?.[claim]);
    } catch {
      return false;
    }
  }

  // ─────────────────────────────────────────────
  // Private: Core Request Helper
  // ─────────────────────────────────────────────

  /**
   * Internal HTTP helper used by all public methods.
   */
  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).catch((err: Error) => {
      throw new TrioPushError(
        `Network error: ${err.message}`,
        undefined,
        undefined,
        err,
      );
    });

    let responseBody: any;
    const contentType = response.headers.get("content-type") ?? "";

    try {
      responseBody = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      responseBody = null;
    }

    if (!response.ok) {
      const message =
        (typeof responseBody === "object" && responseBody?.error) ||
        (typeof responseBody === "object" && responseBody?.message) ||
        `Request failed with status ${response.status}`;

      throw new TrioPushError(message, response.status, responseBody);
    }

    return responseBody as T;
  }

  // ─────────────────────────────────────────────
  // Public: Device Registration
  // ─────────────────────────────────────────────

  /**
   * Register or update a device's FCM token with TrioChat.
   *
   * @param data - Device registration payload
   * @returns Registration result including the assigned device_id
   * @throws {TrioPushError} If the request fails
   *
   * @example
   * ```typescript
   * const result = await client.registerDevice({
   *   fcm_token: 'firebase-token-here',
   *   platform: 'ios',
   *   metadata: {
   *     app_version: '2.0.0',
   *     user_id: 'user-123'
   *   }
   * });
   * ```
   */
  async registerDevice(
    data: RegisterDeviceDto,
  ): Promise<RegisterDeviceResponse> {
    const response = await this.request<ApiResponse<RegisterDeviceResponse>>(
      "POST",
      "/api/devices/register",
      data,
    );
    return response.payload;
  }

  // ─────────────────────────────────────────────
  // Public: Device Fetching
  // ─────────────────────────────────────────────

  /**
   * Fetch all registered devices for the authenticated workspace.
   *
   * @returns Array of registered devices
   * @throws {TrioPushError} If the request fails
   *
   * @example
   * ```typescript
   * const devices = await client.getDevices();
   * const iosDevices = devices.filter(d => d.platform === 'ios');
   * ```
   */
  async getDevices(): Promise<Device[]> {
    const response = await this.request<ApiResponse<{ devices: Device[] }>>(
      "GET",
      "/api/devices",
    );
    return response.payload.devices;
  }

  // ─────────────────────────────────────────────
  // Public: Send Notification
  // ─────────────────────────────────────────────

  /**
   * Send a push notification with full Firebase Cloud Messaging support.
   *
   * Supports platform-specific configurations for Android, iOS (APNs), and Web Push.
   *
   * @param data - Notification payload with optional platform-specific config
   * @returns Delivery result with success/failure counts
   * @throws {TrioPushError} If the request fails
   *
   * @example
   * ```typescript
   * // Basic notification
   * await client.sendNotification({
   *   device_ids: ['device-1', 'device-2'],
   *   notification: { title: 'Hello', body: 'World' }
   * });
   *
   * // With Android config
   * await client.sendNotification({
   *   device_ids: ['android-device-1'],
   *   notification: { title: 'New Message', body: 'You have a message' },
   *   android: {
   *     priority: 'high',
   *     notification: {
   *       channelId: 'chat_messages',
   *       sound: 'default',
   *       color: '#FF0000'
   *     }
   *   }
   * });
   *
   * // With iOS config
   * await client.sendNotification({
   *   device_ids: ['ios-device-1'],
   *   notification: { title: 'New Message', body: 'You have a message' },
   *   apns: {
   *     payload: {
   *       aps: {
   *         sound: 'default',
   *         badge: 1,
   *         alert: {
   *           title: 'New Message',
   *           body: 'You have a message'
   *         }
   *       }
   *     }
   *   }
   * });
   *
   * // With Web Push config
   * await client.sendNotification({
   *   device_ids: ['web-device-1'],
   *   notification: { title: 'Update', body: 'New features available' },
   *   webpush: {
   *     fcmOptions: {
   *       link: 'https://app.example.com/updates'
   *     },
   *     notification: {
   *       icon: '/icon.png',
   *       requireInteraction: true
   *     }
   *   }
   * });
   *
   * // Multi-platform with custom data
   * await client.sendNotification({
   *   device_ids: ['device-1', 'device-2'],
   *   notification: { title: 'Chat', body: 'John sent a file' },
   *   data: {
   *     action: 'open_chat',
   *     chat_id: '789',
   *     message_id: '123'
   *   },
   *   android: { priority: 'high' },
   *   apns: { payload: { aps: { sound: 'default' } } },
   *   fcmOptions: { analyticsLabel: 'chat_notification' }
   * });
   * ```
   */
  async sendNotification(
    data: SendNotificationRequest,
  ): Promise<SendNotificationResponse> {
    const response = await this.request<ApiResponse<SendNotificationResponse>>(
      "POST",
      "/api/notifications/send",
      data,
    );
    return response.payload;
  }

  // ─────────────────────────────────────────────
  // Public: Token Management
  // ─────────────────────────────────────────────

  /**
   * Replace the current authentication token.
   *
   * Note: Changing the token does NOT change the baseUrl. The environment
   * is fixed at construction time based on the initial token's `is_dev` claim.
   *
   * @param token - New JWT / API token
   *
   * @example
   * ```typescript
   * client.setToken(await refreshAuthToken());
   * ```
   */
  setToken(token: string): void {
    if (!token) {
      throw new TrioPushError("Token cannot be empty");
    }
    this.token = token;
  }
}

// ─────────────────────────────────────────────
// Re-exports
// ─────────────────────────────────────────────

export type { RegisterDeviceDto, SendNotificationDto, NotificationPayloadDto };

// Export platform enum for convenience
export { RegisterDeviceDto as RegisterDevicePlatform } from "./generated/models/RegisterDeviceDto";
