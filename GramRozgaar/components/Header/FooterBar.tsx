import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSelector } from "react-redux";
import { selectCurrentTheme } from "@/store/Seletor";

const { height } = Dimensions.get("window");

const FooterBar = () => {
    const router = useRouter();
    const theme = useSelector(selectCurrentTheme); // returns "dark" or "light"

    const isDark = theme === "dark";

    // Define colors based on theme string
    const colorPalette = {
        primary: "#2E5C4D",
        onPrimary: "#ffffff",
        primaryText: isDark ? "#ffffff" : "#2E5C4D",
        footerBackground: isDark ? "#1F2937" : "#f8f8f8",
        border: isDark ? "#374151" : "#ddd",
    };

    const styles = getStyles(colorPalette);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.push("/machines/AllMachines")}>
                <MaterialIcons name="precision-manufacturing" size={28} color={colorPalette.primaryText} />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/home/dashbord")}
                style={styles.homeIconWrapper}
            >
                <FontAwesome5 name="home" size={30} color={colorPalette.onPrimary} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/workers/AllWorkers")}>
                <MaterialIcons name="engineering" size={28} color={colorPalette.primaryText} />
            </TouchableOpacity>
        </View>
    );
};

export default FooterBar;

const getStyles = (themeColors: any) =>
    StyleSheet.create({
        container: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            height: 60,
            backgroundColor: themeColors.footerBackground,
            borderTopWidth: 1,
            borderColor: themeColors.border,
            paddingHorizontal: 20,
            zIndex: 999,
        },
        homeIconWrapper: {
            backgroundColor: themeColors.primary,
            padding: 12,
            borderRadius: 50,
            position: "relative",
            top: -20,
            elevation: 5,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 4,
            shadowOffset: { width: 0, height: 2 },
        },
    });
