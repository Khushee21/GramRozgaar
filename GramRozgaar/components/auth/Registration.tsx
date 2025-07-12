'use client';

import { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, } from "react-native";
import { Auth } from "@/Types/AllTypes";

const AuthScreen = () => {
    const [isSignUp, setIsSignUp] = useState(true);

    const [formData, setFormData] = useState<Auth>({
        name: '',
        Village: '',
        age: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
        WorkType: '',
        IsAvailableForWork: false,
        IsMachineAvailable: false,
        MachineType: '',
        profileImage: ''
    });

    const handleChange = (key: keyof Auth, value: string | boolean) => {
        setFormData({ ...formData, [key]: value });
    };

    const handleSubmit = () => {
        console.log("Submitted Data:", formData);

    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{isSignUp ? 'Sign Up' : 'Sign In'}</Text>

            {isSignUp && (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        value={formData.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Age"
                        value={formData.age}
                        onChangeText={(text) => handleChange("age", text)}
                        keyboardType="numeric"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Village"
                        value={formData.Village}
                        onChangeText={(text) => handleChange("Village", text)}
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
