// Export the main client
export {
  TrioChatNotificationClient,
  TrioPushError,
  type TrioChatNotificationClientConfig,
  type Device,
  type RegisterDeviceResponse,
  type SendNotificationResponse,
  type GetDevicesResponse,
} from "./client";

// Export types for the three endpoints
export type {
  RegisterDeviceDto,
  SendNotificationDto,
  NotificationPayloadDto,
} from "./client";

// Export platform enum for convenience
export { RegisterDeviceDto as RegisterDevicePlatformEnum } from "./generated/models/RegisterDeviceDto";
