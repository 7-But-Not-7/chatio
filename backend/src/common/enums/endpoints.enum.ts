export enum AuthEndpoints{
    LOGIN = 'login',
    REGISTER = 'register',
    REFRESH_TOKEN= 'refresh-token',
    EMAIL_VERIFICATION='email-verification',
    VERIFY_EMAIL='verify-email',
    PHONE_VERIFICATION='phone-verification',
    VERIFY_PHONE='verify-phone',
    RESET_PASSWORD='reset-password',
    FORGOT_PASSWORD='forgot-password',
    LOGOUT='logout',
    LOGOUT_ALL='logout-all',
    VERIFY_SESSION='verify-session',
    GOOGLE_AUTH='google',
    GOOGLE_REDIRECT='google/redirect',
    GOOGLE_AUTH_CALLBACK='google/callback',
}

export enum UserEndpoints{
    CHECK_USERNAME = 'check-username'
}

export enum NotificationEndpoints{
    GET_NOTIFICATIONS = '',
    GET_NOTIFICATION = ':notificationId',
    MARK_AS_READ = 'read/:notificationId',
    MARK_ALL_AS_READ = 'read',
    DELETE_NOTIFICATION = ':notificationId',
    DELETE_ALL_NOTIFICATIONS = '',
}