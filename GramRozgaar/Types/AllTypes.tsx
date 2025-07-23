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

export type Machine = {
    name: string;
    userId: number;
    workType: string;
    isMachineAvailable: boolean;
    machineType?: string;
    star?: number;
    user?: {
        phoneNumber: string;
        profileImage?: string;
    };
};
