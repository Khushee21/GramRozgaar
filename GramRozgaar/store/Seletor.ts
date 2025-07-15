import { RootState } from './store';
export const selectCurrentUser = (state: RootState) => state.user;

export const selectCurrentTheme = (state: RootState) => {
    const phone = state.user?.phoneNumber;
    return phone ? state.preferences[phone]?.theme || 'light' : 'dark';
};

export const selectCurrentLanguage = (state: RootState) => {
    const phone = state.user?.phoneNumber;
    return phone ? state.preferences[phone]?.language || 'en' : 'en';
}