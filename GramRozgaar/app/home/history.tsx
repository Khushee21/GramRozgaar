import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";

const Dashboard = () => {
    return (
        <View style={styles.container}>
            <Header />

            <View style={styles.content}>
                <Image
                    source={{ uri: "https://cdn-icons-png.flaticon.com/512/7486/7486202.png" }}
                    style={styles.image}
                    resizeMode="contain"
                />
                <Text style={styles.heading}>No History Available</Text>
                <Text style={styles.subtext}>
                    Once workers or machines are assigned, their history will be shown here.
                </Text>
            </View>

            <FooterBar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f6f8fa",
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    image: {
        width: 180,
        height: 180,
        marginBottom: 20,
        opacity: 0.8,
    },
    heading: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#2e2e2e",
        marginBottom: 10,
    },
    subtext: {
        fontSize: 16,
        color: "#6b6b6b",
        textAlign: "center",
        lineHeight: 22,
    },
});

export default Dashboard;
