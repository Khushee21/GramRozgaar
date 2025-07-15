import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Preferences = {
    theme: 'light' | 'dark';
    language: 'en' | 'hi';
};

interface PreferencesState {
    [phoneNumber: string]: Preferences;
}

const initialState: PreferencesState = {};

const PreferencesSlice = createSlice({
    name: 'prefrences',
    initialState,
    reducers: {
        setTheme(state,
            action: PayloadAction<{
                phoneNumber: string;
                theme: 'light' | 'dark'
            }>) {
            const { phoneNumber, theme } = action.payload;
            if (!state[phoneNumber]) {
                state[phoneNumber] = {
                    theme,
                    language: 'en'
                };
            }
            else {
                state[phoneNumber].theme = theme;
            }
        },
        setLanguage(state,
            action: PayloadAction<{ phoneNumber: string; language: 'en' | 'hi' }>) {
            const { phoneNumber, language } = action.payload;
            if (!state[phoneNumber]) {
                state[phoneNumber] = { theme: 'light', language };
            }
            else {
                state[phoneNumber].language = language;
            }
        },
        setUserPreference(state, action: PayloadAction<{ phoneNumber: string; prefrences: Preferences }>) {
            const { phoneNumber, prefrences } = action.payload;
            state[phoneNumber] = prefrences;
        }
    }
});

export const { setTheme, setLanguage, setUserPreference } = PreferencesSlice.actions;
export default PreferencesSlice.reducer;
