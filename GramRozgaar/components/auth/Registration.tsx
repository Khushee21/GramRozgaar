'use client';

import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from '@/services/API';
import { Auth } from '@/Types/AllTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import { setUser } from '@/store/UserSlice';
import { useDispatch } from 'react-redux';

const AuthScreen = () => {
    const [isSignUp, setIsSignUp] = useState(true);
    const [success, showSuccess] = useState(false);

    const [formData, setFormData] = useState<Auth>({
        name: '',
        village: '',
        age: 0,
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        workType: '',
        isMachineAvailable: false,
        isAvailableForWork: false,
        machineType: '',
        profileImage: '',
    });

    const dispatch = useDispatch();
    const handleChange = (key: keyof Auth, value: string | boolean) => {
        setFormData({ ...formData, [key]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            handleChange('profileImage', uri);
        }
    };

    const handleSubmit = async () => {
        try {
            if (isSignUp) {
                if (
                    !formData.name || !formData.village || !formData.phoneNumber ||
                    !formData.password || !formData.confirmPassword
                ) {
                    Alert.alert('कृपया सभी आवश्यक फ़ील्ड भरें।');
                    return;
                }

                const res = await fetch(`${API_URL}/users/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Signup failed');
                showSuccess(true);
                dispatch(setUser(data.user));
                Alert.alert('सफलता', 'पंजीकरण सफल रहा!');
            } else {
                const res = await fetch(`${API_URL}/users/signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber: formData.phoneNumber,
                        password: formData.password,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Login failed');
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                Alert.alert('सफलता', 'लॉगिन सफल रहा!');
            }
        } catch (err: any) {
            Alert.alert('त्रुटि', err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'किसान पंजीकरण' : 'किसान लॉगिन'}</Text>

            {isSignUp && (
                <>
                    <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                        <Text style={styles.buttonText}>प्रोफ़ाइल चित्र चुनें</Text>
                    </TouchableOpacity>

                    {formData.profileImage && (
                        <Image
                            source={{ uri: formData.profileImage }}
                            style={styles.avatar}
                        />
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="पूरा नाम"
                        value={formData.name}
                        onChangeText={(text) => handleChange('name', text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="आयु"
                        value={formData.age.toString()}
                        onChangeText={(text) => handleChange('age', text)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="गाँव"
                        value={formData.village}
                        onChangeText={(text) => handleChange('village', text)}
                    />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder="फोन नंबर"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="पासवर्ड"
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry
            />

            {isSignUp && (
                <TextInput
                    style={styles.input}
                    placeholder="पासवर्ड की पुष्टि करें"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange('confirmPassword', text)}
                    secureTextEntry
                />
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>
                    {isSignUp ? 'पंजीकरण करें' : 'लॉगिन करें'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleText}>
                    {isSignUp
                        ? 'पहले से खाता है? लॉगिन करें'
                        : 'नया उपयोगकर्ता? पंजीकरण करें'}
                </Text>
            </TouchableOpacity>
            <LottieView
                source={require('@/assets/gif/home2.json')}
                autoPlay
                loop
                style={styles.trainAnimation}
            />
            {success && (
                <View style={styles.lottieContainer}>
                    <LottieView
                        source={require('@/assets/gif/Done.json')}
                        autoPlay
                        loop={false}
                        style={styles.lottie}
                        onAnimationFinish={() => showSuccess(false)}
                    />
                </View>
            )}
        </ScrollView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 24,
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        color: '#2d6a4f',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#90be6d',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    submitButton: {
        backgroundColor: '#2d6a4f',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    imageButton: {
        backgroundColor: '#90be6d',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '600',
    },
    toggleText: {
        textAlign: 'center',
        color: '#2d6a4f',
        marginTop: 12,
        fontSize: 15,
        fontWeight: '500',
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginBottom: 16,
        borderWidth: 2,
        borderColor: '#2d6a4f',
    },
    trainAnimation: {
        width: width,
        height: 120,
        position: 'absolute',
        bottom: 0,
    },
    lottieContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    lottie: {
        width: 250,
        height: 250,
    },

});
