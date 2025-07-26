import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import MapView, { Marker } from "react-native-maps";
import io from "socket.io-client";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { API_URL } from "@/services/API";

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
    heading: {
        fontSize: 20,
        fontWeight: "bold",
        padding: 10,
        textAlign: "center",
    },
    map: {
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 160,
    },
});

export default LiveLocation;
