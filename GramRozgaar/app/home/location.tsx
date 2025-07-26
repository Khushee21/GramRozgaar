import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, PermissionsAndroid, Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { API_URL } from "@/services/API";
import Geolocation from "@react-native-community/geolocation";
import { authFetch } from "@/services/authFetch";

const socket = io(`${API_URL}`);

type LocationData = {
    userId: string;
    lat: number;
    lng: number;
    updatedAt: string;
};

const LiveLocation = () => {
    const [locations, setLocations] = useState<LocationData[]>([]);

    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );
                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    console.warn("Location permission denied");
                }
            }
        };
        requestPermission();
    }, []);

    const sendLiveLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                authFetch(`${API_URL}/location/update`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    }),
                }).catch((err) => console.error("authFetch error:", err));
            },
            (error) => console.error("Geolocation error:", error),
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    };

    // Send live location every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            sendLiveLocation();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    // Listen to socket updates
    useEffect(() => {
        socket.on("locationUpdate", (data: LocationData[]) => {
            setLocations(data);
        });

        return () => {
            socket.off("locationUpdate");
        };
    }, []);

    return (
        <>
            <Header />
            <View style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 23.1765,
                        longitude: 75.7885,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    }}
                >
                    {locations.map((loc) => (
                        <Marker
                            key={loc.userId}
                            coordinate={{
                                latitude: loc.lat,
                                longitude: loc.lng,
                            }}
                            title={`User: ${loc.userId}`}
                            description={`Updated: ${new Date(loc.updatedAt).toLocaleTimeString()}`}
                        />
                    ))}
                </MapView>
            </View>
            <FooterBar />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 160,
    },
});

export default LiveLocation;
