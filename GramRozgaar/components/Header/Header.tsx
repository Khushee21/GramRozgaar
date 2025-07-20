'use client';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useSelector } from "react-redux";
import { selectCurrentTheme, selectCurrentLanguage, selectCurrentUser } from "@/store/Seletor";
import { LinearGradient } from "expo-linear-gradient";
import { translations } from "@/src/constants/translation";
import Ionicons from "react-native-vector-icons/Ionicons"; // ✅ Fixed this line
import { API_URL } from "@/services/API";
import { authFetch } from "@/services/authFetch";
import { useRouter } from "expo-router";

const Header = () => {
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);
    const t = translations[language];
    const isDark = theme === "dark";
    const user = useSelector(selectCurrentUser);
    const [profileIcon, setProfileIcon] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/auth/LoginRegistrationScreen");
        }
    }, [user]);

    useEffect(() => {
        if (!user) return;

        const fetchImage = async () => {
            try {
                const res = await authFetch(`${API_URL}/users/${user.phoneNumber}/profile-image`, {
                    method: "GET",
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch image");
                }
                const data = await res.json();
                console.log("Profile image:", data.profileImage);
                setProfileIcon(`${API_URL}/uploads/${data.profileImage}`); // ✅ Use full URL to show image
            } catch (err) {
                console.error("Image fetch error:", err);
            }
        };

        fetchImage();
    }, [user]);

    return (
        <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#f5f5f5" }]}>
            <LinearGradient colors={["#2E5C4D", "#68B684"]} style={styles.header}>
                <View style={styles.headerContent}>
                    {profileIcon ? (
                        <Image source={{ uri: profileIcon }} style={styles.icon} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={40} color="#fff" style={styles.icon} />
                    )}
                    <Text style={styles.welcome}>{t.title}</Text>
                </View>
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
    headerContent: {
        alignItems: "center",
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 10,
    },
    welcome: {
        fontSize: 29,
        fontWeight: "bold",
        color: "#fff",
    },
});
