import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";


const { height } = Dimensions.get('window');
const FooterBar = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity >
                <MaterialIcons name="precision-manufacturing" size={28} color="#2E5C4D" />
            </TouchableOpacity>

            <TouchableOpacity

                style={styles.homeIconWrapper}
            >
                <FontAwesome5 name="home" size={30} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity >
                <MaterialIcons name="engineering" size={28} color="#2E5C4D" />
            </TouchableOpacity>
        </View>
    );
};

export default FooterBar;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        height: 60,
        backgroundColor: "#f8f8f8",
        borderTopWidth: 1,
        borderColor: "#ddd",
        paddingHorizontal: 20,
        top: height - 150,
    },
    homeIconWrapper: {
        backgroundColor: "#2E5C4D",
        padding: 12,
        borderRadius: 50,
        position: "relative",
        top: -20,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
});
