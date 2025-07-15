import React from "react";
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useColorScheme } from "@/hooks/useColorScheme.web";
import { useLanguage } from "@/hooks/useLanguageContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";

const Header = () => {

    const theme = useColorScheme();
    const { language, setLanguage } = useLanguage();
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "hi" : "en");
    };

    return (
        <View style={[style.container, { backgroundColor }]}>
            <Text style={[style.logoText, { color: textColor }]}>
                GRAMROZGAAR🌾
            </Text>
        </View>
    )
}
export default Header;

const style = StyleSheet.create({
    container: {
        paddingTop: 120,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        borderBottomWidth: 0.3,
        borderColor: "#ccc",
        borderRadius: 20,
    },
    logoText: {
        fontSize: 29,
        fontWeight: "bold",
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    langText: {
        fontSize: 16,
    },
})