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
                GRAMROZGAAR🌱
            </Text>
            <View style={style.rightSection}>
                <Pressable onPress={toggleLanguage} style={style.iconButton}>
                    <MaterialIcons name="language" size={22} color={textColor} />
                    <Text style={[style.langText, { color: textColor, marginLeft: 5 }]}>
                        {language === "en" ? "English" : "हिन्दी"}
                    </Text>
                </Pressable>
                <MaterialIcons
                    name={theme === "dark" ? "dark-mode" : "light-mode"}
                    size={24}
                    color={textColor}
                    style={{ marginLeft: 20 }}
                />
            </View>
        </View>
    )
}
export default Header;

const style = StyleSheet.create({
    container: {
        paddingTop: 90,
        paddingBottom: 15,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        elevation: 4,
        borderBottomWidth: 0.3,
        borderColor: "#ccc",
    },
    logoText: {
        fontSize: 24,
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