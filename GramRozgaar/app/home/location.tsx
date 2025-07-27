import React, { useEffect, useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Dimensions,
    PermissionsAndroid,
    Platform,
    Alert,
    Text
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import io from "socket.io-client";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { API_URL } from "@/services/API";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/Seletor";
import { jwtDecode } from "jwt-decode";

type LocationData = {
    userId: string;
    latitude: number;
    longitude: number;
    updatedAt: string;
    name?: string;
    emoji?: string;
};

interface MyJwtPayload {
    sub: string | number;
}

const LiveLocation = () => {
    const [locations, setLocations] = useState<LocationData[]>([]);
    const user = useSelector(selectCurrentUser);
    const [userId, setUserId] = useState<string | null>(null);
    const token = user?.token;
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (token) {
            try {
                const decoded = jwtDecode<MyJwtPayload>(token);
                if (decoded?.sub) {
                    setUserId(decoded.sub.toString());
                } else {
                    console.warn("sub (userId) not found in token payload");
                }
            } catch (error) {
                console.error("Invalid token:", error);
            }
        }
    }, [token]);

    // Connect to WebSocket
    useEffect(() => {
        if (!token || socketRef.current) return;

        const socket = io(API_URL, {
            transports: ["websocket"],
            auth: { token },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("✅ Connected:", socket.id);
        });

        socket.on("disconnect", () => {
            console.log("❌ Disconnected");
        });

        return () => {
            socket.disconnect();
        };
    }, [token]);

    useEffect(() => {
        const requestPermission = async () => {
            if (Platform.OS === "android") {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: "Location Permission",
                            message: "This app needs access to your location for tracking.",
                            buttonPositive: "OK",
                        }
                    );
                    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                        Alert.alert("Permission Denied", "Location permission is required.");
                    }
                } catch (err) {
                    console.warn("Permission error:", err);
                }
            }
        };

        requestPermission();
    }, []);

    const sendLiveLocation = async () => {
        if (!userId || !socketRef.current) return;

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Permission Denied", "Location permission is required.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            console.log("📡 Location sent:", location.coords);

            socketRef.current.emit("location", {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error("Location error:", error);
        }
    };

    useEffect(() => {
        if (!userId || !socketRef.current) return;

        const interval = setInterval(sendLiveLocation, 10000);
        return () => clearInterval(interval);
    }, [userId]);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const listener = (data: LocationData[]) => {
            setLocations(
                data.map((loc) => ({
                    userId: loc.userId.toString(),
                    latitude: Number(loc.latitude),
                    longitude: Number(loc.longitude),
                    updatedAt: loc.updatedAt,
                    name: loc.name,
                    emoji: loc.emoji || "📍"
                }))
            );
        };

        socket.on("locationUpdate", listener);
        return () => {
            socket.off("locationUpdate", listener);
        };
    }, []);

    if (!userId) return null;

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
                                latitude: loc.latitude,
                                longitude: loc.longitude,
                            }}
                            title={`${loc.emoji || "📍"} ${loc.name || `User: ${loc.userId}`}`}

                            description={`Updated at: ${new Date(loc.updatedAt).toLocaleTimeString()}`}
                        >
                            <View style={styles.emojiMarker}>
                                <Text style={styles.emojiText}>{loc.emoji || "📍"}</Text>
                            </View>
                            <Callout>
                                <View style={styles.callout}>
                                    <Text style={styles.calloutTitle}>{loc.name || `User: ${loc.userId}`}</Text>
                                    <Text style={styles.calloutText}>ID: {loc.userId}</Text>
                                    <Text style={styles.calloutText}>Updated: {new Date(loc.updatedAt).toLocaleTimeString()}</Text>
                                </View>
                            </Callout>
                        </Marker>

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
    emojiMarker: {
        backgroundColor: "white",
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    emojiText: {
        fontSize: 20,
    },
    callout: {
        minWidth: 150,
        padding: 10,
        backgroundColor: "white",
        borderRadius: 10,
        elevation: 2,
    },
    calloutTitle: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 4,
    },
    calloutText: {
        fontSize: 14,
    },

});

export default LiveLocation;
