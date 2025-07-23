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
    userId: number;
    name: string;
    workType: string;
    machineType?: string;
    isMachineAvailable?: boolean;
    star?: number;
    machineImages?: string[];
    user?: {
        phoneNumber?: string;
        profileImage?: string;
    };
};

export type Worker = {
    userId: number;
    name: string;
    workType: string;
    isAvailableToWork?: boolean;
    star?: number;
    user?: {
        phoneNumber?: string;
        profileImage?: string;
    }
}