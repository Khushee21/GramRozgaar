'use client';

import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { API_URL } from "@/services/API";
import { Auth } from "@/Types/AllTypes";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthScreen = () => {
    const [isSignUp, setIsSignUp] = useState(true);

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
        profileImage: ''
    });

    const handleChange = (key: keyof Auth, value: string | boolean) => {
        setFormData({ ...formData, [key]: value });
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const uri = result.assets[0].uri;
            handleChange("profileImage", uri);
        }
    };

    const handleSubmit = async () => {
        try {
            if (isSignUp) {
                const res = await fetch(`${API_URL}/users/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Signup failed");
                Alert.alert("Success", "User registered successfully!");
                console.log("Signup Success:", data);
            } else {
                const res = await fetch(`${API_URL}/users/signin`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        phoneNumber: formData.phoneNumber,
                        password: formData.password
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Login failed");
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                Alert.alert("Success", "User logged in successfully!");
                console.log("Login Success:", data);
            }
        } catch (err: any) {
            Alert.alert("Error", err.message);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

            {isSignUp && (
                <>
                    <TouchableOpacity style={styles.button} onPress={pickImage}>
                        <Text style={styles.buttonText}>Choose Profile Image</Text>
                    </TouchableOpacity>

                    {formData.profileImage ? (
                        <Image
                            source={{ uri: formData.profileImage }}
                            style={{ width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginBottom: 16 }}
                        />
                    ) : null}

                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        value={formData.age.toString()}
                        onChangeText={(text) => handleChange("age", text)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Village"
                        value={formData.village}
                        onChangeText={(text) => handleChange("village", text)}
                    />
                </>
            )}

            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChangeText={(text) => handleChange("phoneNumber", text)}
                keyboardType="phone-pad"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                secureTextEntry
            />

            {isSignUp && (
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(text) => handleChange("confirmPassword", text)}
                    secureTextEntry
                />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>{isSignUp ? "Register" : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.toggleText}>
                    {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AuthScreen;

const styles = StyleSheet.create({
    container: {
        padding: 24,
        justifyContent: 'center',
        flexGrow: 1,
        backgroundColor: '#fefefe',
    },
    title: {
        fontSize: 26,
        fontWeight: '600',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#0066cc',
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    toggleText: {
        textAlign: 'center',
        color: '#007bff',
        marginTop: 12,
    },
});
