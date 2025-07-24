import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Preferences = {
    theme: 'light' | 'dark';
    language: 'en' | 'hi';
};

interface PreferencesState {
    [phoneNumber: string]: Preferences;
}

const initialState: PreferencesState = {};

const preferencesSlice = createSlice({
    name: 'preferences',
    initialState,
    reducers: {
        setTheme(
            state,
            action: PayloadAction<{
                phoneNumber: string;
                theme: 'light' | 'dark';
            }>
        ) {
            const { phoneNumber, theme } = action.payload;
            if (!state[phoneNumber]) {
                state[phoneNumber] = {
                    theme,
                    language: 'en'
                };
            } else {
                state[phoneNumber].theme = theme;
            }
        },
        setLanguage(
            state,
            action: PayloadAction<{ phoneNumber: string; language: 'en' | 'hi' }>
        ) {
            const { phoneNumber, language } = action.payload;
            if (!state[phoneNumber]) {
                state[phoneNumber] = {
                    theme: 'light',
                    language
                };
            } else {
                state[phoneNumber].language = language;
            }
        },
        setUserPreference(
            state,
            action: PayloadAction<{
                phoneNumber: string;
                preferences: Preferences;
            }>
        ) {
            const { phoneNumber, preferences } = action.payload;
            state[phoneNumber] = preferences;
        }
    }
});

export const { setTheme, setLanguage, setUserPreference } = preferencesSlice.actions;
export default preferencesSlice.reducer;
