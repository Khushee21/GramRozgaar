export interface Auth {
    village: string;
    name: string;
    age: number;
    workType?: string;
    isMachineAvailable?: boolean;
    isAvailableForWork?: boolean;
    machineType?: string;
    phoneNumber: string;
    profileImage?: string | null;
    password: string;
    confirmPassword: string;
    languagePreference?: 'en' | 'hi';
}
