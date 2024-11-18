export interface ProfileData {
  id: string | null;
  displayName: string | null;
  email: string | null;
  phoneNumber: string;
  gender: 'male' | 'female' | null;
  name: Record<string, any> | null; // Adjust this if you have a specific structure for `name`
  profilePicture: string;
}

export class ProfileHelper {
  static extractProfileFields(profile: any): ProfileData{
    const {
      id,
      displayName,
      emails = [],
      gender = null,
      phoneNumbers = [],
      name = null,
      photos = [],
    } = profile;

    return {
      id,
      displayName,
      email: emails[0]?.value || null,
      phoneNumber: phoneNumbers[0]?.value || '',
      gender: gender === 'male' || gender === 'female' ? gender : null,
      name,
      profilePicture: photos[0]?.value || '',
    };
  }
}
