'use client';
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import {
    selectCurrentTheme,
    selectCurrentLanguage,
    selectCurrentUser
} from "@/store/Seletor";
import { LinearGradient } from "expo-linear-gradient";
import { translations } from "@/src/constants/translation";
import Ionicons from "react-native-vector-icons/Ionicons";
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
            console.log("No user found");
            router.push("/auth/LoginRegistrationScreen");
        }
    }, [user]);

    useEffect(() => {
        const fetchImage = async (): Promise<void> => {
            try {
                const res = await authFetch(`${API_URL}/users/user-profile?phoneNumber=${user.phoneNumber}`, {
                    method: "GET",
                });

                if (!res.ok) throw new Error("Failed to fetch image");

                const data = await res.json();
                setProfileIcon(`${API_URL}/uploads/${data.profileImage}`);
            } catch (err) {
                console.error("Image fetch error:", err);
            }
        };

        fetchImage();
    }, [user]);

    return (
        <LinearGradient colors={["#2E5C4D", "#68B684"]} style={styles.header}>
            <View style={styles.headerContent}>
                <Text style={styles.title}>{t.title}</Text>
                <TouchableOpacity onPress={() => router.push('/auth/Profile')}>
                    {profileIcon ? (
                        <Image source={{ uri: profileIcon }} style={styles.icon} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={45} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
};

export default Header;


const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
    },
    icon: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
    },
});
