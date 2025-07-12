export interface Auth {
    Village: string;
    name: string;
    age: string;
    WorkType?: string;
    IsMachineAvailable?: boolean;
    IsAvailableForWork?: boolean;
    MachineType?: string;
    phoneNumber: string;
    profileImage: string | null;
    password: string;
    confirmPassword: string;
}
