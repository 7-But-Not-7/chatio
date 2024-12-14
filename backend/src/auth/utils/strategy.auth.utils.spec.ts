import { StrategyAuthHelper } from './strategy.auth.utils';
import { GoogleRawProfile, GoogleProfile } from 'src/common/types/auth';


describe('StrategyAuthHelper', () => {
    describe('getGoogleProfile', () => {
        it('should return a GoogleProfile with all fields populated', () => {
            const rawProfile: GoogleRawProfile = {
                id: '123',
                displayName: 'John Doe',
                emails: [{ value: 'john.doe@example.com' }],
                phoneNumbers: [{ value: '123-456-7890' }],
                photos: [{ value: 'http://example.com/photo.jpg' }],
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const expectedProfile: GoogleProfile = {
                id: '123',
                displayName: 'John Doe',
                email: 'john.doe@example.com',
                phoneNumber: '123-456-7890',
                profilePicture: 'http://example.com/photo.jpg',
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const result = StrategyAuthHelper.getGoogleProfile(rawProfile);
            expect(result).toEqual(expectedProfile);
        });

        it('should handle missing optional fields gracefully', () => {
            const rawProfile: GoogleRawProfile = {
                id: '123',
                displayName: 'John Doe',
                emails: [],
                phoneNumbers: [],
                photos: [],
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const expectedProfile: GoogleProfile = {
                id: '123',
                displayName: 'John Doe',
                email: undefined,
                phoneNumber: undefined,
                profilePicture: undefined,
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const result = StrategyAuthHelper.getGoogleProfile(rawProfile);
            expect(result).toEqual(expectedProfile);
        });

        it('should handle completely missing optional fields', () => {
            const rawProfile: Partial<GoogleRawProfile> = {
                id: '123',
                displayName: 'John Doe',
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const expectedProfile: GoogleProfile = {
                id: '123',
                displayName: 'John Doe',
                email: undefined,
                phoneNumber: undefined,
                profilePicture: undefined,
                name: { familyName: 'Doe', givenName: 'John' },
                gender: 'male'
            };

            const result = StrategyAuthHelper.getGoogleProfile(rawProfile as GoogleRawProfile);
            expect(result).toEqual(expectedProfile);
        });
    });
});