/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateTokenDto } from '../models/CreateTokenDto';
import type { RegisterDeviceDto } from '../models/RegisterDeviceDto';
import type { SendNotificationDto } from '../models/SendNotificationDto';
import type { TokenResponseDto } from '../models/TokenResponseDto';
import type { UploadFirebaseCredentialsDto } from '../models/UploadFirebaseCredentialsDto';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class TrioPushService {
    /**
     * Create a JWT token for push notification API access
     * Generate a JWT token containing workspace_id and user_id for authenticating push notification requests
     * @param requestBody
     * @returns TokenResponseDto Token created successfully
     * @throws ApiError
     */
    public static authControllerCreateToken(
        requestBody: CreateTokenDto,
    ): CancelablePromise<TokenResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/auth/create-token',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Upload Firebase service account credentials
     * Upload Firebase service account JSON for a workspace to enable push notifications
     * @param requestBody
     * @returns any Credentials uploaded successfully
     * @throws ApiError
     */
    public static firebaseCredentialsControllerUploadCredentials(
        requestBody: UploadFirebaseCredentialsDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/credentials/upload',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get Firebase credentials status for workspace
     * @param workspaceId
     * @returns any Credentials status retrieved
     * @throws ApiError
     */
    public static firebaseCredentialsControllerGetCredentials(
        workspaceId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/credentials',
            query: {
                'workspace_id': workspaceId,
            },
            errors: {
                404: `Credentials not found`,
            },
        });
    }
    /**
     * Delete Firebase credentials for workspace
     * @param workspaceId
     * @returns any Credentials deleted
     * @throws ApiError
     */
    public static firebaseCredentialsControllerDeleteCredentials(
        workspaceId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/credentials',
            query: {
                'workspace_id': workspaceId,
            },
        });
    }
    /**
     * Register or update a device FCM token
     * @param requestBody
     * @returns any Device registered successfully
     * @throws ApiError
     */
    public static registerDevice(
        requestBody: RegisterDeviceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/devices/register',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Query devices by workspace or user
     * @returns any
     * @throws ApiError
     */
    public static deviceControllerFindDevices(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/devices',
        });
    }
    /**
     * Send a push notification to one or more devices
     * @param requestBody
     * @returns any Notification accepted for delivery
     * @throws ApiError
     */
    public static notificationControllerSend(
        requestBody: SendNotificationDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/notifications/send',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
