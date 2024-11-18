export enum ErrorMessages{
    INVALID_LOGIN_CREDENTIALS = "Invalid login credentials",
    NO_DEVICE_ID = "No device id provided",
    EMAIL_ALREADY_EXISTS = "Email already exists",
    PHONE_NUMBER_ALREADY_EXISTS = "Phone number already exists",
    USERNAME_ALREADY_EXISTS = "Username already exists",
    LOGIN_FAILED = "Login failed",
    REGISTER_FAILED = "Registration failed",
    EMAIL_NOT_FOUND = "Email not found",
    SEND_EMAIL_VERIFICATION_CODE_FAILED = "Failed to send email verification code",
    INVALID_EMAIL_VERIFICATION_CODE = "Invalid email verification code",
    ERROR_VERIFYING_EMAIL = "Error verifying email",
    PHONE_NUMBER_NOT_FOUND = "Phone number not found",
    SEND_PHONE_VERIFICATION_CODE_FAILED = "Failed to send phone verification code",
    ERROR_SENDING_PASSWORD_RESET_CODE = "Error sending password reset code",
    INVALID_PHONE_VERIFICATION_CODE = "Invalid phone verification code",
    ERROR_VERIFYING_PHONE_NUMBER = "Error verifying phone number",
    INVALID_PASSWORD_RESET_CODE = "Invalid password reset code",
    ERROR_RESETTING_PASSWORD = "Error resetting password",
    INVALID_REFRESH_TOKEN = "Invalid refresh token",
    SESSION_EXPIRED = "Session has expired",
    INVALID_SESSION = "Session is not valid",
    INVALID_TOKEN="Authorization token missing or invalid",
    AUTHGUARD_DEFAULT= "Invalid or expired token",
    USER_VALIDATION="An error occurred while validating or creating the user."
}