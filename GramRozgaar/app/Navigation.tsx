// Navigation.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './home/HomeScreen';
import LoginRegistrationScreen from './auth/LoginRegistrationScreen';
import AdditionalInfo from './auth/AdditionalInfo';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/Seletor';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Dashboard from './home/dashbord';
import HomeDashboard from './home/HomeDashboard';
import Workers from './home/Workers';
import AllMachines from './home/Machine';
import UserProfile from './auth/Profile';

const Stack = createNativeStackNavigator();

export default function Navigation() {
    const user = useSelector(selectCurrentUser);
    const [infoDone, setInfoDone] = useState<boolean | null>(null);

    useEffect(() => {
        const checkInfo = async () => {
            if (user?.phoneNumber) {
                const done = await AsyncStorage.getItem(`infoDone-${user.phoneNumber}`);
                setInfoDone(done === 'true');
            } else {
                setInfoDone(false);
            }
        };
        checkInfo();
    }, [user]);

    if (infoDone === null && user) return null;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Login" component={LoginRegistrationScreen} />
                ) : !infoDone ? (
                    <Stack.Screen name="Info" component={AdditionalInfo} />
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                        <Stack.Screen name="HomeDashboard" component={HomeDashboard} />
                        <Stack.Screen name="Workers" component={Workers} />
                        <Stack.Screen name="Machines" component={AllMachines} />
                        <Stack.Screen name="Profile" component={UserProfile} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );

}
