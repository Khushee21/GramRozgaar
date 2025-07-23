import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useSelector } from "react-redux";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import {
    selectCurrentLanguage,
    selectCurrentUser,
    selectCurrentTheme,
} from "@/store/Seletor";
import { authFetch } from "@/services/authFetch";
import { API_URL } from "@/services/API";

type Machine = {
    userId: number;
    name: string;
    workType: string;
    machineType?: string;
    isMachineAvailable?: boolean;
    star?: number;
    machineImages?: string[];
    user?: {
        phoneNumber?: string;
        profileImage?: string;
    };
};

const AllMachines = () => {
    const user = useSelector(selectCurrentUser);
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);

    const [machines, setMachines] = useState<Machine[]>([]);

    useEffect(() => {
        const fetchAllMachines = async () => {
            try {
                const res = await authFetch(`${API_URL}/workers`, {
                    method: "GET",
                });
                const data = await res.json();
                setMachines(data);
            } catch (err) {
                console.log("Error fetching machines:", err);
            }
        };

        fetchAllMachines();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>🚜 All Available Machines</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {machines.length === 0 ? (
                    <Text style={styles.noDataText}>No machines available</Text>
                ) : (
                    machines.map((machine, index) => (
                        <View key={index} style={styles.card}>
                            {machine.user?.profileImage && (
                                <Image
                                    source={{ uri: `${API_URL}/uploads/${machine.user.profileImage}` }}
                                    style={styles.profileImage}
                                />
                            )}

                            <Text style={styles.cardTitle}>{machine.name}</Text>
                            <Text style={styles.machineType}>{machine.machineType || "General"}</Text>

                            <Text style={styles.cardText}>📞 {machine.user?.phoneNumber || "N/A"}</Text>
                            <Text style={styles.cardText}>🛠️ Work Type: {machine.workType}</Text>
                            <Text style={styles.cardText}>⭐ Rating: {machine.star || "N/A"}</Text>

                            <Text style={machine.isMachineAvailable ? styles.available : styles.unavailable}>
                                {machine.isMachineAvailable ? "✅ Available" : "❌ Not Available"}
                            </Text>
                            {machine.machineImages && machine.machineImages.length > 0 && (
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageGallery}>
                                    {machine.machineImages.map((img, idx) => (
                                        <Image
                                            key={idx}
                                            source={{ uri: `${API_URL}/uploads/machineImg/${img}` }}
                                            style={styles.machineImage}
                                        />
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>
            <FooterBar />
        </View>
    );
};

export default AllMachines;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginVertical: 16,
        textAlign: "center",
        color: "#155E75",
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: "#fff",
        padding: 20,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
        color: "#1F2937",
    },
    cardText: {
        fontSize: 14,
        color: "#4B5563",
        marginVertical: 2,
    },
    machineType: {
        fontSize: 16,
        fontWeight: "600",
        color: "#10B981",
        marginBottom: 4,
    },
    available: {
        marginTop: 8,
        color: "#059669",
        fontWeight: "bold",
    },
    unavailable: {
        marginTop: 8,
        color: "#DC2626",
        fontWeight: "bold",
    },
    noDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "#6B7280",
        marginTop: 30,
    },
    profileImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "#D1D5DB",
    },
    imageGallery: {
        marginTop: 12,
        width: "100%",
    },
    machineImage: {
        width: 100,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
    },
});