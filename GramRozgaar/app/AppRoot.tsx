// AppRoot.tsx
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginRegistrationScreen from './auth/LoginRegistrationScreen';
import HomeScreen from './home/HomeScreen';
import { LanguageProvider } from '@/hooks/useLanguageContext';

const Stack = createNativeStackNavigator();

export default function AppRoot() {
    return (
        <Provider store={store}>
            <LanguageProvider>
                <NavigationContainer>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Login" component={LoginRegistrationScreen} />
                        <Stack.Screen name="Home" component={HomeScreen} />
                    </Stack.Navigator>
                </NavigationContainer>
            </LanguageProvider>
        </Provider>
    );
}
