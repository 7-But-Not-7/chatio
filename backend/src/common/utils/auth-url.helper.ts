/**
 * Will create google redirect url
 */
export class AuthUrlHelper {
  private readonly baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

  constructor(
    private readonly clientId: string,
    private readonly redirectUri: string,
  ) {}

  generateGoogleAuthUrl(deviceId: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: 'email profile',
      state: deviceId, // Including `deviceId` in the state
    });

    return `${this.baseUrl}?${params.toString()}`;
  }
}
