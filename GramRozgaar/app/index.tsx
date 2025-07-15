import { View } from "react-native";
import LoginRegistration from "./auth/LoginRegistrationScreen";
import { LanguageProvider } from "@/hooks/useLanguageContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function Home() {
    return (
        <Provider store={store}>
            <LanguageProvider>
                <View style={{ flex: 1 }}>
                    <LoginRegistration />
                </View>
            </LanguageProvider>
        </Provider>
    );
}

export const options = {
    headerShown: false,
};