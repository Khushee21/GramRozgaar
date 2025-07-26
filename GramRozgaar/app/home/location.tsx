import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, PermissionsAndroid, Platform, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { API_URL } from "@/services/API";
import * as Location from "expo-location";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/store/Seletor";
import { jwtDecode } from "jwt-decode";
import { socket } from "@/components/auth/Socket";

// Socket server expects userId — we'll use 'sub' from token
type LocationData = {
    userId: string;
    lat: number;
    lng: number;
    updatedAt: string;
};

interface MyJwtPayload {
    sub: string | number; // use sub as userId
}

const LiveLocation = () => {
    const [locations, setLocations] = useState<LocationData[]>([]);
    const user = useSelector(selectCurrentUser);
    const [userId, setUserId] = useState<string | null>(null);
    const [socket, setSocket] = useState<any>(null);
    const token = user?.token;

    // ✅ Decode token and use 'sub' as userId
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

    // ✅ Initialize socket connection
    useEffect(() => {
        if (!token) return;

        const newSocket = io(API_URL, {
            transports: ["websocket"],
            auth: { token },
        });

        newSocket.on("connect", () => {
            console.log("✅ Connected:", newSocket.id);
        });

        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected");
        });

        // Your event handlers...

        setSocket(newSocket);

        return () => {
            newSocket.disconnect(); // ✅ clean up
        };
    }, [token]); // ✅ only re-run when token changes


    // ✅ Request location permission for Android
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

    // ✅ Send live location to server
    const sendLiveLocation = async () => {
        if (!userId || !socket) return;
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

            socket.emit("location", {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
        } catch (error) {
            console.error("Location error:", error);
        }
    };

    // ✅ Interval to send location every 10 seconds
    useEffect(() => {
        if (!userId || !socket) return;

        const interval = setInterval(sendLiveLocation, 10000);
        return () => clearInterval(interval);
    }, [userId, socket]);

    // ✅ Socket listener cleanup
    useEffect(() => {
        if (!socket) return;

        const listener = (data: LocationData[]) => {
            setLocations(data);
        };

        socket.on("locationUpdate", listener);

        return () => {
            socket.off("locationUpdate", listener);
        };
    }, [socket]);

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
                                latitude: loc.lat,
                                longitude: loc.lng,
                            }}
                            title={`User: ${loc.userId}`}
                            description={`Updated at: ${new Date(loc.updatedAt).toLocaleTimeString()}`}
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
