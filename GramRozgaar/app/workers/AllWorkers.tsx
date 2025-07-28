import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    Linking,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { authFetch } from "@/services/authFetch";
import { API_URL } from "@/services/API";
import { useSelector } from "react-redux";
import {
    selectCurrentLanguage,
    selectCurrentTheme,
    selectCurrentUser,
} from "@/store/Seletor";
import { translations } from "@/src/constants/translation";
import { Worker } from "@/Types/AllTypes";

const AllWorkerPage = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const language = useSelector(selectCurrentLanguage);
    const theme = useSelector(selectCurrentTheme);
    const t = translations[language];
    const styles = getStyles(theme);

    useEffect(() => {
        const fetchAllWorker = async () => {
            try {
                const res = await authFetch(`${API_URL}/workers/all-workers`, {
                    method: "GET",
                });
                const data = await res.json();
                setWorkers(data);
            } catch (err: any) {
                console.log("Error fetching workers:", err);
            }
        };
        fetchAllWorker();
    }, []);

    const filteredWorkers = workers.filter((worker) => {
        const name = worker.name?.toLowerCase() || "";
        const id = worker.userId?.toString() || "";
        const query = searchQuery.toLowerCase();
        return name.includes(query) || id.includes(query);
    });

    return (
        <View style={styles.container}>
            <Header />

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.heading}>👷 All Workers</Text>

                <TextInput
                    style={styles.searchBox}
                    placeholder="🔍 Search by name or user ID"
                    placeholderTextColor={theme === "dark" ? "#9CA3AF" : "#6B7280"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                {filteredWorkers.length === 0 ? (
                    <Text style={styles.noDataText}>🚫 No workers available</Text>
                ) : (
                    filteredWorkers.map((worker, index) => (
                        <View key={index} style={styles.card}>
                            <View style={styles.row}>
                                {worker.user?.profileImage && (
                                    <Image
                                        source={{ uri: `${API_URL}/uploads/${worker.user.profileImage}` }}
                                        style={styles.profileImage}
                                    />
                                )}

                                <View style={styles.cardContent}>
                                    <Text style={styles.cardTitle}>
                                        {worker.name || "Unnamed Worker"}
                                    </Text>

                                    {worker.user?.phoneNumber ? (
                                        <TouchableOpacity
                                            onPress={() => Linking.openURL(`tel:${worker.user?.phoneNumber}`)}
                                        >
                                            <Text style={[styles.cardText, styles.phoneText]}>
                                                📞 {worker.user.phoneNumber}
                                            </Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <Text style={styles.cardText}>📞 N/A</Text>
                                    )}

                                    <Text style={styles.cardText}>
                                        🛠️ {t.work || "Work"}: {worker.workType || "N/A"}
                                    </Text>

                                    <Text style={styles.cardText}>
                                        ⭐ {t.rating || "Rating"}: {worker.star || "N/A"}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <FooterBar />
        </View>
    );
};

export default AllWorkerPage;

const getStyles = (theme: string) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme === "dark" ? "#111827" : "#F0F4F8",
        },
        scrollContainer: {
            padding: 16,
            paddingBottom: 100,
        },
        heading: {
            fontSize: 24,
            fontWeight: "bold",
            color: theme === "dark" ? "#F3F4F6" : "#1F2937",
            textAlign: "center",
            marginVertical: 20,
        },
        searchBox: {
            width: "100%",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 16,
            marginBottom: 20,
            backgroundColor: theme === "dark" ? "#1F2937" : "#fff",
            color: theme === "dark" ? "#F3F4F6" : "#000",
        },
        card: {
            backgroundColor: theme === "dark" ? "#1F2937" : "#ffffff",
            padding: 16,
            marginBottom: 16,
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        row: {
            flexDirection: "row",
            alignItems: "center",
        },
        profileImage: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 2,
            borderColor: "#E5E7EB",
            marginRight: 16,
        },
        cardContent: {
            flex: 1,
        },
        cardTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: theme === "dark" ? "#F9FAFB" : "#111827",
            marginBottom: 4,
        },
        cardText: {
            fontSize: 14,
            color: theme === "dark" ? "#D1D5DB" : "#374151",
            marginVertical: 1,
        },
        phoneText: {
            color: theme === "dark" ? "#93C5FD" : "#1D4ED8",
            textDecorationLine: "underline",
            fontWeight: "bold",
        },
        noDataText: {
            textAlign: "center",
            fontSize: 16,
            color: theme === "dark" ? "#9CA3AF" : "#6B7280",
            marginTop: 30,
        },
    });
