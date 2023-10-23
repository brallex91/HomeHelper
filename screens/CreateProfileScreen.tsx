import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function CreateProfile() {
    const emojis = ['🦊', '🐷', '🐸', '🐥', '🐙', '🐬', '🦉', '🦄'];

    return (
        <View style={{ alignItems: "center" }}>
            <Text>Text: Välj avatar</Text>
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
