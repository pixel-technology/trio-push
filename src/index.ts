export { TrioChatNotificationClient, TrioPushError } from "./client";

// Clean type exports (no DTO suffix)
export type { TrioChatNotificationClientConfig } from "./client";
export type { Device } from "./client";
export type { RegisterDeviceResponse } from "./client";
export type { SendNotificationResponse } from "./client";
export type { GetDevicesResponse } from "./client";

// Clean input types (rename DTO → cleaner names)
export type { RegisterDeviceDto as RegisterDeviceInput } from "./client";
export type { SendNotificationDto as SendNotificationInput } from "./client";
export type { NotificationPayloadDto as NotificationPayload } from "./client";

// ✅ Clean platform enum — access like TrioPushPlatform.IOS
import { RegisterDeviceDto } from "./generated/models/RegisterDeviceDto";

export const TrioPushPlatform = {
  IOS: RegisterDeviceDto.platform.IOS,
  ANDROID: RegisterDeviceDto.platform.ANDROID,
  WEB: RegisterDeviceDto.platform.WEB,
} as const;

export type TrioPushPlatformType =
  (typeof TrioPushPlatform)[keyof typeof TrioPushPlatform];
