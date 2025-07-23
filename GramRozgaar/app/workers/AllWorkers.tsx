import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { View, Text, StyleSheet, Image } from "react-native";
import { useEffect, useState } from "react";
import { authFetch } from "@/services/authFetch";
import { API_URL } from "@/services/API";
import { selectCurrentLanguage, selectCurrentTheme, selectCurrentUser } from "@/store/Seletor";
import { useSelector } from "react-redux";
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
                const res = await authFetch(`${API_URL}/workerAvailable`, {
                    method: 'GET',
                });
                const data = await res.json();
                setWorkers(data);
                console.log(data);
            }
            catch (err: any) {
                console.log("Error fetching machines:", err);
            }
        };
        fetchAllWorker();
    }, [])
    return (
        <View style={styles.container}>
            <Header />
            <Text>All WOrkers </Text>
            {workers.length === 0 ? (
                <Text > No workers available</Text>
            ) : (
                workers.map((worker, index) => (
                    <View key={index}>
                        {worker.user?.profileImage && (
                            < Image
                                source={{ uri: `${API_URL}/uploads/${worker.user.profileImage}` }}
                            />
                        )}
                        <Text style={styles.cardText}>📞 {worker.user?.phoneNumber || "N/A"}</Text>
                        <Text style={styles.cardText}>🛠️ {t.work}: {worker.workType}</Text>
                        <Text style={styles.cardText}>⭐ {t.rating || "Rating"}: {worker.star || "N/A"}</Text>
                    </View>
                ))
            )}
            <FooterBar />
        </View>
    )
}
export default AllWorkerPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
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
})