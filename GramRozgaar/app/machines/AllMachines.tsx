import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    Linking,
    TouchableOpacity,
    TextInput
} from "react-native";
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
import { Machine } from "@/Types/AllTypes";
import { translations } from "@/src/constants/translation";

const AllMachines = () => {
    const language = useSelector(selectCurrentLanguage);
    const theme = useSelector(selectCurrentTheme);
    const styles = getStyles(theme);

    const [searchQuery, setSearchQuery] = useState("");
    const [machines, setMachines] = useState<Machine[]>([]);
    const t = translations[language];

    useEffect(() => {
        const fetchAllMachines = async () => {
            try {
                const res = await authFetch(`${API_URL}/workers/all-machines`, {
                    method: "GET",
                });
                const data = await res.json();
                setMachines(data);
            } catch (err: any) {
                //console.log("Error fetching machines:", err);
            }
        };

        fetchAllMachines();
    }, []);

    // 🔍 Filter machines by name or userId
    const filteredMachines = machines.filter((machine) => {
        const id = machine.userId?.toString() || "";
        const query = searchQuery.toLowerCase();
        return id.includes(query);
    });

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>🚜 {t.machineImages}</Text>

                <TextInput
                    style={styles.searchBox}
                    placeholder="🔍 Search by name or user ID"
                    placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {filteredMachines.length === 0 ? (
                    <Text style={styles.noDataText}>
                        {t.noMachinesAvailable || "No machines available"}
                    </Text>
                ) : (
                    filteredMachines.map((machine, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.row}>
                                {machine.user?.profileImage && (
                                    <Image
                                        source={{
                                            uri: `${API_URL}/uploads/${machine.user.profileImage}`,
                                        }}
                                        style={styles.profileImage}
                                    />
                                )}

                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>{machine.name}</Text>
                                    <Text style={styles.cardText}>
                                        {machine.machineType || t.machineType}
                                    </Text>

                                    {machine.user?.phoneNumber ? (
                                        <TouchableOpacity
                                            onPress={() =>
                                                Linking.openURL(`tel:${machine.user?.phoneNumber}`)
                                            }
                                        >
                                            <Text style={[styles.cardText, styles.phoneText]}>
                                                📞 {machine.user?.phoneNumber}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.cardText}>📞 N/A</Text>
                                    )}

                                    <Text style={styles.cardText}>
                                        ⭐ {t.rating || "Rating"}: {machine.star || "N/A"}
                                    </Text>

                                    <Text
                                        style={
                                            machine.isMachineAvailable
                                                ? styles.available
                                                : styles.unavailable
                                        }
                                    >
                                        {machine.isMachineAvailable
                                            ? `✅ ${t.available || "Available"}`
                                            : `❌ ${t.notAvailable || "Not Available"}`}
                                    </Text>
                                </View>
                            </View>

                            {machine.machineImages && machine.machineImages.length > 0 && (
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    style={styles.imageGallery}
                                >
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

const getStyles = (theme: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "dark" ? "#111827" : "#F3F4F6",
        },
        scrollContent: {
            padding: 16,
            paddingBottom: 300,
            flexGrow: 1,
            alignItems: "center",
        },
        title: {
            fontSize: 26,
            fontWeight: "700",
            color: theme === "dark" ? "#F3F4F6" : "#00796b",
            textAlign: "center",
            marginBottom: 16,
        },
        searchBox: {
            width: "100%",
            maxWidth: 400,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            marginBottom: 16,
            backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
            color: theme === "dark" ? "#F3F4F6" : "#000",
        },
        card: {
            backgroundColor: theme === "dark" ? "#1F2937" : "rgba(255, 255, 255, 0.9)",
            borderRadius: 16,
            padding: 24,
            width: "100%",
            maxWidth: 400,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
            elevation: 8,
            alignSelf: "center",
            marginBottom: 20,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            marginRight: 16,
            borderWidth: 2,
            borderColor: "#E5E7EB",
        },
        cardContent: {
            flex: 1,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: "700",
            color: theme === "dark" ? "#F9FAFB" : "#1F2937",
            marginBottom: 4,
        },
        cardText: {
            fontSize: 14,
            color: theme === "dark" ? "#D1D5DB" : "#4B5563",
            marginVertical: 2,
        },
        phoneText: {
            color: "#2563EB",
            textDecorationLine: "underline",
        },
        available: {
            marginTop: 6,
            color: "#10B981",
            fontWeight: "bold",
        },
        unavailable: {
            marginTop: 6,
            color: "#EF4444",
            fontWeight: "bold",
        },
        imageGallery: {
            marginTop: 12,
            paddingLeft: 8,
        },
        machineImage: {
            width: 100,
            height: 80,
            borderRadius: 10,
            marginRight: 10,
        },
        noDataText: {
            textAlign: "center",
            fontSize: 16,
            color: theme === "dark" ? "#9CA3AF" : "#6B7280",
            marginTop: 30,
        },
    });
