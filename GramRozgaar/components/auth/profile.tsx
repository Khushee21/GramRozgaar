import { useEffect, useState } from "react";
import {
    ScrollView,
    Text,
    View,
    Image,
    StyleSheet,
    ActivityIndicator,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Alert,
    Button,
    Switch,
} from "react-native";
import { useSelector } from "react-redux";
import { API_URL } from "@/services/API";
import { authFetch } from "@/services/authFetch";
import Header from "@/components/Header/Header";
import {
    selectCurrentUser,
    selectCurrentLanguage,
    selectCurrentTheme,
} from "@/store/Seletor";
import { translations } from "@/src/constants/translation";
import LottieView from "lottie-react-native";
import { Dimensions } from "react-native";
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get("window");

const Profile = () => {
    const user = useSelector(selectCurrentUser);
    const language = useSelector(selectCurrentLanguage);
    const t = translations[language];

    const [userInfo, setUserInfo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [editableInfo, setEditableInfo] = useState<any>({});
    const [machineImages, setMachineImages] = useState<string[]>([]);

    const [isAvailableForWork, setAvailableForWork] = useState(false);
    const [isMachineAvailable, setIsMachineAvailable] = useState(false);
    const [work, setWork] = useState('');
    const [machine, setMachine] = useState('');

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
            allowsEditing: true,
        });

        if (!result.canceled) {
            const selected = result.assets.map((asset) => asset.uri);
            setMachineImages((prev) => [...prev, ...selected]);
        }
    };

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (!user) return;
            console.log(user);
            try {
                const res = await authFetch(`${API_URL}/users/user-profile`);
                console.log(res.json);
                if (!res.ok) throw new Error("Failed to fetch user info");

                const data = await res.json();
                const profile = Array.isArray(data) ? data[0] : null;

                setUserInfo(profile);
                setEditableInfo(profile);

                // Set initial switches and inputs
                setAvailableForWork(profile?.isAvailableForWork || false);
                setIsMachineAvailable(profile?.isMachineAvailable || false);
                setWork(profile?.workType || '');
                setMachine(profile?.machineType || '');
            } catch (error) {
                console.error("Error fetching userInfo:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchUserInfo();
    }, [user]);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('workType', work);
            formData.append('isAvailableForWork', isAvailableForWork.toString());
            formData.append('isMachineAvailable', isMachineAvailable.toString());
            formData.append('machineType', machine);
            machineImages.forEach((uri) => {
                const filename = uri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename ?? '');
                const type = match ? `image/${match[1]}` : `image`;

                formData.append('machineImages', {
                    uri,
                    name: filename,
                    type,
                } as any);
            });
            const res = await authFetch(`${API_URL}/users/${editableInfo.userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const json = await res.json();
            if (!res.ok) throw new Error("Update failed");
            Alert.alert("✅ Success", "Profile updated successfully.");
        } catch (err) {
            console.error(err);
            Alert.alert("❌ Error", "Failed to update profile.");
        }
    };

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00aaff" />
            </View>
        );
    }

    if (!userInfo) {
        return (
            <View style={styles.loader}>
                <Text>No data available</Text>
            </View>
        );
    }

    return (
        <SafeAreaView >
            <Header />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.heading}>👤 {t.EditProfile}</Text>

                <View style={styles.card}>
                    <Text style={styles.label}>Emp ID:</Text>
                    <TextInput
                        style={styles.input}
                        value={editableInfo?.userId?.toString() || ""}
                        editable={false}
                    />

                    <View style={styles.toggleContainer}>
                        <Text style={styles.label}>{t.availableForWork}</Text>
                        <Switch
                            value={isAvailableForWork}
                            onValueChange={setAvailableForWork}
                        />
                    </View>

                    {isAvailableForWork && (
                        <>
                            <Text style={styles.label}>{t.workType}</Text>
                            <TextInput
                                placeholder="जैसे: खेती, मजदूरी, ट्रैक्टर चलाना"
                                value={work}
                                onChangeText={setWork}
                                style={styles.input}
                            />
                        </>
                    )}

                    <View style={styles.toggleContainer}>
                        <Text style={styles.label}>{t.machineAvailable}</Text>
                        <Switch
                            value={isMachineAvailable}
                            onValueChange={setIsMachineAvailable}
                        />
                    </View>

                    {isMachineAvailable && (
                        <>
                            <Text style={styles.label}>{t.machineType}</Text>
                            <TextInput
                                placeholder="जैसे: ट्रैक्टर, कल्टीवेटर"
                                value={machine}
                                onChangeText={setMachine}
                                style={styles.input}
                            />

                            <Text style={styles.label}>{t.machineImages}</Text>
                            {editableInfo?.machineImages?.map((imgUrl: string, idx: number) => (
                                <Image
                                    key={idx}
                                    source={{ uri: imgUrl }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            ))}

                            <View style={{ marginVertical: 20 }}>
                                <Button title="Pick Images" onPress={handleImagePick} />
                                <ScrollView horizontal style={{ marginTop: 10 }}>
                                    {machineImages.map((uri, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri }}
                                            style={{
                                                width: 100,
                                                height: 100,
                                                marginRight: 10,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: '#ccc',
                                            }}
                                        />
                                    ))}
                                </ScrollView>
                            </View>
                        </>
                    )}

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>💾 Save</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <LottieView
                source={require('@/assets/gif/home2.json')}
                autoPlay
                loop
                style={styles.trainAnimation}
            />
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
        paddingBottom: 300,
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
    input: {
        fontSize: 16,
        fontWeight: "500",
        color: "#222",
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginTop: 12,
    },
    addButton: {
        marginTop: 12,
        backgroundColor: "#00796b",
        padding: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    saveButton: {
        marginTop: 24,
        backgroundColor: "#2E5C4D",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    loader: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    trainAnimation: {
        width: width,
        height: 0,
        position: "absolute",
        bottom: 0,
    }, toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
});
