import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { authFetch } from "@/services/authFetch";
import { API_URL } from "@/services/API";
import { useSelector } from "react-redux";
import { selectCurrentLanguage, selectCurrentTheme, selectCurrentUser } from "@/store/Seletor";
import { translations } from "@/src/constants/translation";
import { Worker } from "@/Types/AllTypes";

const AllWorkerPage = () => {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const user = useSelector(selectCurrentUser);
    const language = useSelector(selectCurrentLanguage);
    const theme = useSelector(selectCurrentTheme);
    const t = translations[language];

    useEffect(() => {
        const fetchAllWorker = async () => {
            try {
                const res = await authFetch(`${API_URL}/workers/all-workers`, {
                    method: 'GET',
                });
                const data = await res.json();
                setWorkers(data);
                console.log("Fetched workers:", data);
            } catch (err: any) {
                console.log("Error fetching workers:", err);
            }
        };
        fetchAllWorker();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.heading}>{"All Workers"}</Text>

                {workers.length === 0 ? (
                    <Text style={styles.noDataText}>🚫 {"No workers available"}</Text>
                ) : (
                    workers.map((worker, index) => (
                        <View key={index} style={styles.card}>
                            {worker.user?.profileImage && (
                                <Image
                                    source={{ uri: `${API_URL}/uploads/${worker.user.profileImage}` }}
                                    style={styles.profileImage}
                                />
                            )}
                            <Text style={styles.cardTitle}>{worker.name || "Unnamed Worker"}</Text>
                            <Text style={styles.cardText}>📞 {worker.user?.phoneNumber || "N/A"}</Text>
                            <Text style={styles.cardText}>🛠️ {t.work || "Work"}: {worker.workType}</Text>
                            <Text style={styles.cardText}>⭐ {t.rating || "Rating"}: {worker.star || "N/A"}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <FooterBar />
        </View>
    );
};

export default AllWorkerPage;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
    },
    scrollContainer: {
        padding: 16,
        paddingBottom: 100, // space for footer
    },
    heading: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#1F2937",
        textAlign: "center",
        marginVertical: 20,
    },
    card: {
        backgroundColor: "#ffffff",
        padding: 20,
        marginBottom: 16,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: "center",
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
        borderWidth: 2,
        borderColor: "#E5E7EB",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
        marginBottom: 6,
    },
    cardText: {
        fontSize: 14,
        color: "#374151",
        marginVertical: 2,
    },
    noDataText: {
        textAlign: "center",
        fontSize: 16,
        color: "#6B7280",
        marginTop: 30,
    },
});
