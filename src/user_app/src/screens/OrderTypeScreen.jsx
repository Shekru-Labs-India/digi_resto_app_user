import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Bottom from "../component/bottom";
import Header from "../components/Header";

const OrderTypeScreen = () => {
    const navigation = useNavigation();
    const outlets = {
        code: "03", // Example outlet code, replace dynamically
        section_id: 4,
        table_no: 1
    };

    const handleOrderTypeSelection = async (orderType) => {
        let payload = {};
        if (orderType === "dining") {
            payload = {
                "user_app_url": "https://menumitra-testing.netlify.app/user_app/",
                "outlet_code": "814744",
                "section_id": outlets.section_id,
                "table_number": outlets.table_no
            };
        } else {
            payload = {
                "user_app_url": "https://menumitra-testing.netlify.app/user_app/",
                "outlet_code": "1",
                "order_type": orderType
            };
        }

        try {
            const response = await fetch("https://men4u.xyz/common_api/send_qr_link", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            console.log("API Response:", data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }

        const url = `/user_app/${outlets.code}/s${outlets.section_id}/t${outlets.table_no}`;
        navigation.navigate("Home", { url });
    };

    return (
        <View style={styles.container}>
            <Header />
            <View style={styles.buttonContainer}>
                {['Parcel', 'Delivery', 'Counter', 'Dining'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={styles.button}
                        onPress={() => handleOrderTypeSelection(type.toLowerCase())}
                    >
                        <Text style={styles.buttonText}>{type}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <Bottom />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    buttonContainer: { flexDirection: "row", justifyContent: "space-around", padding: 20 },
    button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" }
});

export default OrderTypeScreen;
