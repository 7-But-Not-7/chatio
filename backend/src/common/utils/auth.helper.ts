import { GoogleProfile, GoogleRawProfile } from "src/common/types/auth";

export class AuthHelper {

  static getGoogleProfile(profile: GoogleRawProfile): GoogleProfile {
    return {
      id: profile.id,
      displayName: profile.displayName,
      email: profile.emails?.[0]?.value,
      phoneNumber: profile?.phoneNumbers?.[0]?.value,
      profilePicture: profile.photos?.[0]?.value,
      name: profile?.name,
      gender: profile?.gender
    }
  }

}
