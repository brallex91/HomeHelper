import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text, TextInput, useTheme } from "react-native-paper";

export default function CreateProfile() {
    const emojis = ['🦊', '🐷', '🐸', '🐥', '🐙', '🐬', '🦉', '🦄'];
    
    const theme = useTheme();

    return (
        <View style={{ alignItems: "center" }}>
            <TextInput placeholder="Profile Name" />
            <Text style={styles.title}>Välj avatar</Text>
            <View style={styles.emojiContainer}>
                {rowArray(emojis, 4).map((row, rowIndex) => (
                    <View style={styles.emojiRow} key={rowIndex}>
                        {row.map((emoji, index) => (
                            <Text style={styles.emoji} key={index}>
                                {emoji}
                            </Text>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
}

function rowArray(array: string[] , rowSize: number) {
    const result = [];
    for (let i = 0; i < array.length; i += rowSize) {
        result.push(array.slice(i, i + rowSize));
    }
    return result;
}

const styles = StyleSheet.create({
    emojiContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 24
    },
    emojiRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    emoji: {
        fontSize: 45,
        flex: 1,
        maxWidth: "25%",
        alignItems: "center",
    },
});
