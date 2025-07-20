// services/authFetch.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from './API';

export async function authFetch(url: string, options: RequestInit = {}) {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const userData = await AsyncStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;

    const isFormData = options.body instanceof FormData;

    const authOptions: RequestInit = {
        ...options,
        headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${accessToken}`,
            ...(isFormData ? {} : { 'Content-Type': 'application/json' }), // ✅ Only set for JSON
        },
    };

    let response = await fetch(url, authOptions);

    // Retry logic unchanged
    if (response.status === 401 && refreshToken && user?.id) {
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
            await AsyncStorage.setItem('accessToken', refreshData.accessToken);
            await AsyncStorage.setItem('refreshToken', refreshData.refreshToken);

            const retryOptions: RequestInit = {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${refreshData.accessToken}`,
                    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
                },
            };

            response = await fetch(url, retryOptions);
        } else {
            throw new Error('Session expired. Please login again.');
        }
    }

    return response;
}
