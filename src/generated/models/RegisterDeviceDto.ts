/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type RegisterDeviceDto = {
    fcm_token: string;
    platform: RegisterDeviceDto.platform;
    metadata?: Record<string, any>;
};
export namespace RegisterDeviceDto {
    export enum platform {
        IOS = 'ios',
        ANDROID = 'android',
        WEB = 'web',
    }
}

