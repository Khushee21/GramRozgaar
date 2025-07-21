import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
} from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "@/services/API";
import { authFetch } from "@/services/authFetch";
import Header from "@/components/Header/Header";
import { selectCurrentUser, selectCurrentLanguage, selectCurrentTheme, } from "@/store/Seletor";
import { translations } from "@/src/constants/translation";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";
const { width } = Dimensions.get('window');

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const t = translations[language];

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user) {
                console.log('usr not found');
            }
            try {
                const res = await authFetch(`${API_URL}/users/user-profile`, {
                    method: "GET",
                });
                if (!res.ok) throw new Error("Failed to fetch user info");

                const data = await res.json();
                // console.log("Fetched userInfo:", data);
                setUserInfo(Array.isArray(data) ? data[0] : null);
            } catch (error) {
                console.error("Error fetching userInfo:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserInfo();
    }, [user]);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00aaff" />
            </View>
        );
    }

    if (!userInfo) {
        return (<>
            <Text>no data is avaiable </Text>
        </>)
    }
    return (
        <SafeAreaView >
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.heading}>👤 {t.EditProfile}</Text>

                <View style={styles.card}>
                    {/* Optional Avatar */}
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {userInfo?.workType?.charAt(0) || "U"}
                        </Text>
                    </View>

                    <Text style={styles.label}>User ID:</Text>
                    <Text style={styles.value}>{userInfo?.userId}</Text>

                    <Text style={styles.label}>{t.workType}:</Text>
                    <Text style={styles.value}>{userInfo?.workType || "N/A"}</Text>

                    <Text style={styles.label}>{t.availableForWork}:</Text>
                    <Text style={[styles.badge, userInfo?.isAvailableForWork ? styles.available : styles.unavailable]}>
                        {userInfo?.isAvailableForWork ? "✅ " : "❌ "}
                    </Text>

                    <Text style={styles.label}>{t.machineAvailable}:</Text>
                    <Text style={[styles.badge, userInfo?.isMachineAvailable ? styles.available : styles.unavailable]}>
                        {userInfo?.isMachineAvailable ? "✅ " : "❌"}
                    </Text>

                    <Text style={styles.label}>{t.machineType}:</Text>
                    <Text style={styles.value}>{userInfo?.machineType || "N/A"}</Text>

                    {userInfo?.machineImages?.length > 0 && (
                        <>
                            <Text style={styles.label}>{t.machineImages}:</Text>
                            {userInfo.machineImages.map((imgUrl: string, idx: number) => (
                                <Image
                                    key={idx}
                                    source={{ uri: imgUrl }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ))}
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};
export default Profile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e0f7fa",
    },
    scrollContent: {
        padding: 16,
        flexGrow: 1,
        alignItems: "center",
    },
    heading: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#00796b",
        textAlign: "center",
    },
    card: {
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        maxWidth: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#555",
        marginTop: 14,
    },
    value: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222",
        marginTop: 4,
    },
    badge: {
        fontSize: 14,
        fontWeight: "bold",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        alignSelf: "flex-start",
        marginTop: 6,
    },
    available: {
        backgroundColor: "#d0f8ce",
        color: "#2e7d32",
    },
    unavailable: {
        backgroundColor: "#ffebee",
        color: "#c62828",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginTop: 12,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#00796b",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginBottom: 20,
    },
    avatarText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
    },
    trainAnimation: {
        width: width,
        height: 120,
        position: 'absolute',
        bottom: 0,
    },
});
