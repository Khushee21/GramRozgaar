'use client';

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useRouter } from 'expo-router';
import Header from '@/components/Header/HomepageHeader';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fef9f4' }}>
            <Header />

            <View style={styles.container}>
                <LottieView
                    source={require('@/assets/gif/home1.json')}
                    autoPlay
                    loop
                    style={styles.mainAnimation}
                />

                <Text style={styles.subtitle}>
                    Empowering Farmers, Connecting Villages 🚜
                </Text>

                {/* Start Button */}
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => router.push('/auth/LoginRegistrationScreen')}
                >
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>
            </View>
            <LottieView
                source={require('@/assets/gif/home2.json')}
                autoPlay
                loop
                style={styles.trainAnimation}
            />
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
    },
    subtitle: {
        fontSize: 16,
        color: '#606060',
        textAlign: 'center',
        marginVertical: 12,
    },
    mainAnimation: {
        width: width * 0.75,
        height: 260,
    },
    trainAnimation: {
        width: width,
        height: 120,
        position: 'absolute',
        bottom: 0,
    },
    startButton: {
        backgroundColor: '#2d6a4f',
        paddingVertical: 12,
        paddingHorizontal: 36,
        borderRadius: 30,
        marginTop: 20,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});
