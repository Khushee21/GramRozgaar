import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import Header from "@/components/Header/Header";
import FooterBar from "@/components/Header/FooterBar";
import { selectCurrentLanguage, selectCurrentUser, selectCurrentTheme } from "@/store/Seletor";
import { authFetch } from "@/services/authFetch";
import { Machine } from "@/Types/AllTypes";

const AllMachines = () => {
    const user = useSelector(selectCurrentUser);
    const theme = useSelector(selectCurrentTheme);
    const language = useSelector(selectCurrentLanguage);

    const [machines, setMachines] = useState<Machine[]>([]);

    useEffect(() => {
        const fetchAllMachines = async () => {
            try {
                const res = await authFetch(`/users/allMachines`, {
                    method: 'GET',
                });
                const data = await res.json();
                setMachines(data);
            } catch (err) {
                console.log('Error fetching machines:', err);
            }
        };

        fetchAllMachines();
    }, []);

    return (
        <View style={styles.container}>
            <Header />
            <Text style={styles.title}>All Machines</Text>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {machines.length === 0 ? (
                    <Text style={styles.noDataText}>No machines available</Text>
                ) : (
                    machines.map((machine, index) => (
                        <View key={index} style={styles.card}>
                            <Text style={styles.cardTitle}>{machine.name}</Text>
                            <Text style={styles.cardText}>Phone: {machine.phoneNumber}</Text>
                            <Text style={styles.cardText}>Type: {machine.workType}</Text>
                            <Text style={styles.cardText}>Rating: ⭐ {machine.star}</Text>
                        </View>
                    ))
                )}
            </ScrollView>
            <FooterBar />
        </View>
    );
};

export default AllMachines;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 16,
        color: '#2E5C4D',
        textAlign: 'center',
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 100, // space for footer
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    cardText: {
        fontSize: 14,
        color: '#333',
    },
    noDataText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
        marginTop: 20,
    },
});
