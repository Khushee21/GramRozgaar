import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentTheme, selectCurrentLanguage, selectCurrentUser } from "@/store/Seletor";
import { LinearGradient } from "expo-linear-gradient";
import { translations } from "@/src/constants/translation";

const Header = () => {
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);
    const t = translations[language];
    const isDark = theme === "dark";
    const user = useSelector(selectCurrentUser);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
            <LinearGradient colors={["#2E5C4D", "#68B684"]} style={styles.header}>
                <Text style={styles.welcome}>{t.title}</Text>
            </LinearGradient>

        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 0.3,
        borderColor: "#ccc",
        borderRadius: 20,
        elevation: 4,
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingLeft: 5,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    welcome: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#fff",
    },
});
