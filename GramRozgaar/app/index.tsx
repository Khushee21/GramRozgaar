import { View } from "react-native";
import LoginRegistration from "./auth/LoginRegistrationScreen";
import { LanguageProvider } from "@/hooks/useLanguageContext"; // make sure this is correctly defined

export default function Home() {
    return (
        <LanguageProvider>
            <View style={{ flex: 1 }}>
                <LoginRegistration />
            </View>
        </LanguageProvider>
    );
};

export const options = {
    headerShown: false,
};