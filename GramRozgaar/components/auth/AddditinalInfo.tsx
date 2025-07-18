import {
    View,
    Text,
    TextInput,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    Switch,
    Dimensions,
} from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/Seletor";
import LottieView from "lottie-react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Auth } from "@/Types/AllTypes";
import { API_URL } from "@/services/API";

const { width } = Dimensions.get('window');

const Info = () => {

    const [isAvailableForWork, setAvailableForWork] = useState<boolean>(false);
    const [work, setWork] = useState<string>("");
    const [isMachineAvailable, setIsMachineAvailable] = useState<boolean>(false);
    const [machine, SetMachine] = useState<string>("");
    const [machineImages, setMachineImages] = useState<string[]>([]);

    const user = useSelector(selectCurrentUser);

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
    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('isAvailableForWork', String(isAvailableForWork));
        formData.append('isMachineAvailable', String(isMachineAvailable));
        formData.append('workType', work);
        formData.append('machineType', machine);

        machineImages.forEach((uri, index) => {
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename ?? '');
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('machineImage', {
                uri,
                name: filename,
                type,
            } as any);
        });
        const token = user?.token;
        try {
            const res = await fetch(`${API_URL}/users/userInfo`, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await res.json();
            console.log(result);
        } catch (err: any) {
            console.log('Submission error', err);
        }

        console.log("Submit info:", {
            isAvailableForWork,
            work,
            isMachineAvailable,
            machine,
            machineImages,
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <LinearGradient colors={["#2E5C4D", "#68B684"]} style={styles.header}>
                <Text style={styles.welcome}>नमस्ते, {user?.name} 👋</Text>
                <Text style={styles.subheading}>कृपया अपने बारे में जानकारी दें</Text>
            </LinearGradient>

            <View style={styles.formCard}>
                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>क्या आप काम के लिए उपलब्ध हैं?</Text>
                    <Switch
                        value={isAvailableForWork}
                        onValueChange={setAvailableForWork}
                    />
                </View>

                {isAvailableForWork && (
                    <>
                        <Text style={styles.label}>आप किस प्रकार का काम करते हैं?</Text>
                        <TextInput
                            placeholder="जैसे: खेती, मजदूरी, ट्रैक्टर चलाना"
                            value={work}
                            onChangeText={setWork}
                            style={styles.input}
                        />
                    </>
                )}

                <View style={styles.toggleContainer}>
                    <Text style={styles.label}>क्या आपके पास कोई मशीन है?</Text>
                    <Switch
                        value={isMachineAvailable}
                        onValueChange={setIsMachineAvailable}
                    />
                </View>

                {isMachineAvailable && (
                    <>
                        <Text style={styles.label}>मशीन का प्रकार</Text>
                        <TextInput
                            placeholder="जैसे: ट्रैक्टर, कल्टीवेटर"
                            value={machine}
                            onChangeText={SetMachine}
                            style={styles.input}
                        />

                        <Text style={styles.label}>मशीन की तस्वीरें अपलोड करें</Text>
                        <TouchableOpacity onPress={handleImagePick} style={styles.uploadButton}>
                            <Text style={styles.uploadText}>+ तस्वीरें चुनें</Text>
                        </TouchableOpacity>

                        <View style={styles.imageGrid}>
                            {machineImages.map((uri, index) => (
                                <Image
                                    key={index}
                                    source={{ uri }}
                                    style={styles.uploadedImage}
                                />
                            ))}
                        </View>
                    </>
                )}

                <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                    <Text style={styles.buttonText}>🚀 जानकारी भेजें</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.skipButton}
                onPress={() => {
                    console.log("Skipped!");
                }}
            >
                <Text style={styles.skipText}>छोड़ें</Text>
            </TouchableOpacity>

            <LottieView
                source={require('@/assets/gif/home2.json')}
                autoPlay
                loop
                style={styles.trainAnimation}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: 160,
        backgroundColor: "#F4F7F8",
    },
    header: {
        paddingTop: 60,
        paddingBottom: 30,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: "center",
    },
    welcome: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
    },
    subheading: {
        fontSize: 16,
        color: "#E0F7EC",
        textAlign: "center",
        marginTop: 5,
    },
    formCard: {
        backgroundColor: "#fff",
        margin: 20,
        borderRadius: 16,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: "#2E5C4D",
        fontWeight: "600",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "#F9F9F9",
        marginBottom: 10,
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 10,
    },
    uploadButton: {
        backgroundColor: "#DCF5E7",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 10,
    },
    uploadText: {
        color: "#2E5C4D",
        fontWeight: "bold",
    },
    imageGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginTop: 10,
    },
    uploadedImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    button: {
        backgroundColor: "#2E5C4D",
        padding: 15,
        borderRadius: 12,
        marginTop: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    trainAnimation: {
        width: width,
        height: 120,
        position: 'absolute',
        bottom: 0,
    },
    skipButton: {
        position: "absolute",
        bottom: 130,
        right: 20,
        backgroundColor: "#2E5C4D",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    skipText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});

export default Info;
