// services/authFetch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './API';

export async function authFetch(url: string, options: RequestInit = {}) {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const authOptions = {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    };

    let response = await fetch(url, authOptions);

    if (response.status === 401 && refreshToken && user?.id) {
        // Try refreshing tokens
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.id,
                refreshToken,
            }),
        });

        const refreshData = await refreshRes.json();

        if (refreshRes.ok) {
            // Save new tokens
            await AsyncStorage.setItem('accessToken', refreshData.accessToken);
            await AsyncStorage.setItem('refreshToken', refreshData.refreshToken);

            // Retry original request with new access token
            const retryOptions = {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${refreshData.accessToken}`,
                    'Content-Type': 'application/json',
                },
            };

            response = await fetch(url, retryOptions);
        } else {
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}
