import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentTheme, selectCurrentLanguage } from "@/store/Seletor";

const Header = () => {
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);

    const isDark = theme === "dark";

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
            <Text style={[styles.title, { color: isDark ? "#fff" : "#000" }]}>
                {language === "hi" ? "ग्रामरोज़गार" : "GramRozgaar"}
            </Text>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        letterSpacing: 1,
    },
});
