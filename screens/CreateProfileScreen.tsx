import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { auth } from "../database/firebaseConfig";

const userMockUID = "oYWnfRp0yKWX5fFwG9JxQ6IYppt1";
const userID = auth.currentUser?.uid || userMockUID;

const emojis: string[] = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"];

const getColorForEmoji = (emoji: string) => {
  switch (emoji) {
    case "🦊":
      return "#ff7e46";
    case "🐷":
      return "#ffab91";
    case "🐸":
      return "#e4fb7d";
    case "🐥":
      return "#fcd932";
    case "🐙":
      return "#cd5d6f";
    case "🐬":
      return "#5dc5d6";
    case "🦉":
      return "#e1ae93";
    case "🦄":
      return "#ce84ce";
    default:
      return "#ff7e46";
  }
};

const EmojiSelector = () => {
  const theme = useTheme();
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [profileName, setProfileName] = useState<Profile | null>(null);
  const [emojiColor, setEmojiColor] = useState("#000000");

  const handleEmojiClick = (emoji: string) => {
    setSelectedEmoji(emoji);
    setEmojiColor(getColorForEmoji(emoji));
  };

  const handleButtonPress = () => {
    console.log(selectedEmoji);
    console.log(userMockUID);
  };
  
  const renderEmojis = () => {
    return emojis.map((emoji, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => handleEmojiClick(emoji)}
        style={[
          styles.emojiContainer,
          {
            backgroundColor: getColorForEmoji(emoji),
            borderColor:
              emoji === selectedEmoji ? "#000000" : getColorForEmoji(emoji),
          }, 
        ]}
      >
        <Text style={[styles.emojiText, { color: theme.colors.primary }]}>
          {emoji}
        </Text>
      </TouchableOpacity>
    ));
  };

  return (
    <View style={styles.container}>       
        <TextInput style={styles.textinput} placeholder="Profilnamn"></TextInput>       
      <ScrollView>
        <View style={styles.emojiList}>{renderEmojis()}</View>
      </ScrollView>
      {/* <Text style={{ color: theme.colors.secondary }}>
        Selected Emoji: {selectedEmoji || "None"}, {userMockUID}
      </Text> */}
      <Button style={styles.button} onPress={() => handleButtonPress()}>Skapa Profil</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", 
  },
  emojiContainer: {
    width: "25%",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 60,
    borderWidth: 3 
  },
  emojiText: {
    fontSize: 36,
  },
  textinput: {
    width: "90%",
    marginTop: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: "black"
  }
});

export default EmojiSelector;