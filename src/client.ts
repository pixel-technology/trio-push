import type { RegisterDeviceDto } from "./generated/models/RegisterDeviceDto";
import type { SendNotificationDto } from "./generated/models/SendNotificationDto";
import type { NotificationPayloadDto } from "./generated/models/NotificationPayloadDto";

/**
 * Configuration options for TrioChatNotificationClient
 */
export interface TrioChatNotificationClientConfig {
  /**
   * JWT token for authentication
   */
  token: string;
}

/**
 * Device information returned from the API
 */
export interface Device {
  id: string;
  fcm_token: string;
  platform: "ios" | "android" | "web";
  metadata?: Record<string, any>;
  workspace_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Response from device registration
 */
export interface RegisterDeviceResponse {
  message: string;
  device_id?: string;
}

/**
 * Response from sending notifications
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
 * Response from getting devices
 */
export interface GetDevicesResponse {
  devices: Device[];
  total: number;
}

/**
 * Custom error class for Trio Push API errors
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

/**
 * Professional client for Trio Chat Push Notifications
 *
 * @example
 * ```typescript
 * const client = new TrioChatNotificationClient({
 *   token: 'your-jwt-token'
 * });
 *
 * // Register a device
 * await client.registerDevice({
 *   fcm_token: 'device-fcm-token',
 *   platform: 'ios',
 *   metadata: { app_version: '1.0.0' }
 * });
 *
 * // Get all devices
 * const devices = await client.getDevices();
 *
 * // Send a notification
 * await client.sendNotification({
 *   device_ids: ['device-1', 'device-2'],
 *   notification: {
 *     title: 'New Message',
 *     body: 'You have a new message'
 *   },
 *   data: { chat_id: '123' }
 * });
 * ```
 */
export class TrioChatNotificationClient {
  private token: string;

  constructor(config: TrioChatNotificationClientConfig) {
    if (!config.token) {
      throw new TrioPushError("Token is required for authentication");
    }

    this.token = config.token;
  }

  /**
   * Internal helper that wraps fetch with auth headers and error handling
   */
  private async request<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    path: string,
    body?: unknown,
  ): Promise<T> {
    const url = `https://triochat-push.onrender.com${path}`;

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
        (typeof responseBody === "object" && responseBody?.message) ||
        `Request failed with status ${response.status}`;
      throw new TrioPushError(message, response.status, responseBody);
    }

    return responseBody as T;
  }

  /**
   * Register or update a device FCM token
   *
   * @param data - Device registration data
   * @returns Promise with registration response
   * @throws {TrioPushError} If registration fails
   *
   * @example
   * ```typescript
   * await client.registerDevice({
   *   fcm_token: 'device-fcm-token',
   *   platform: 'ios',
   *   metadata: {
   *     app_version: '1.0.0',
   *     device_model: 'iPhone 14'
   *   }
   * });
   * ```
   */
  async registerDevice(
    data: RegisterDeviceDto,
  ): Promise<RegisterDeviceResponse> {
    return this.request<RegisterDeviceResponse>(
      "POST",
      "/api/devices/register",
      data,
    );
  }

  /**
   * Get all devices for the authenticated workspace/user
   *
   * @returns Promise with list of devices
   * @throws {TrioPushError} If fetching devices fails
   *
   * @example
   * ```typescript
   * const response = await client.getDevices();
   * console.log(`Found ${response.total} devices`);
   * response.devices.forEach(device => {
   *   console.log(`Device ${device.id}: ${device.platform}`);
   * });
   * ```
   */
  // Change the return type
  async getDevices(): Promise<Device[]> {
    const response = await this.request<GetDevicesResponse>(
      "GET",
      "/api/devices",
    );
    return response.devices; // unwrap here
  }

  /**
   * Send a push notification to one or more devices
   *
   * @param data - Notification data including recipients and content
   * @returns Promise with send response including success/failure counts
   * @throws {TrioPushError} If sending notification fails
   *
   * @example
   * ```typescript
   * // Send to specific devices
   * await client.sendNotification({
   *   device_ids: ['device-1', 'device-2'],
   *   notification: {
   *     title: 'New Message',
   *     body: 'John sent you a file'
   *   },
   *   data: {
   *     action: 'open_chat',
   *     chat_id: '123'
   *   }
   * });
   *
   * // Send to all devices (omit device_ids)
   * await client.sendNotification({
   *   notification: {
   *     title: 'System Announcement',
   *     body: 'Maintenance scheduled tonight'
   *   }
   * });
   * ```
   */
  async sendNotification(
    data: SendNotificationDto,
  ): Promise<SendNotificationResponse> {
    return this.request<SendNotificationResponse>(
      "POST",
      "/api/notifications/send",
      data,
    );
  }

  /**
   * Update the authentication token
   *
   * @param token - New JWT token
   *
   * @example
   * ```typescript
   * client.setToken('new-jwt-token');
   * ```
   */
  setToken(token: string): void {
    this.token = token;
  }
}

// Re-export types for convenience
export type { RegisterDeviceDto, SendNotificationDto, NotificationPayloadDto };

// Re-export platform enum
export { RegisterDeviceDto as RegisterDevicePlatform } from "./generated/models/RegisterDeviceDto";
