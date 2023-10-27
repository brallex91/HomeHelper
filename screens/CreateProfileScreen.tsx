import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { addProfile } from "../api/profiles";
import { auth } from "../database/firebaseConfig";
import { ProfileCreate } from "../store/profileSlice";

const userMockUID = "oYWnfRp0yKWX5fFwG9JxQ6IYppt1";
const userID = auth.currentUser?.uid || userMockUID;
const emojis = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"] as const;
type Emoji = typeof emojis[number];

const getColorForEmoji = (emoji?: Emoji) => {
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
  const navigation = useNavigation();
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [profileData, setProfileData] = useState<ProfileCreate>({
    name: "",
    avatar: "",
    userId: userID
  });
  const [emojiColor, setEmojiColor] = useState("#000000");

  const handleEmojiClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setEmojiColor(getColorForEmoji(emoji));
    setProfileData((prevData) => ({
      ...prevData,
      avatar: emoji,
    }));
  };

  const handleButtonPress = async () => {
     addProfile(profileData);
     navigation.navigate("HouseholdChores");
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
        <TextInput value={profileData.name} 
                   style={styles.textinput} 
                   onChangeText={(text) =>
                    setProfileData({ ...profileData, name: text })
                  }
                   placeholder="Profilnamn" />       
      <ScrollView>
        <View style={styles.emojiList}>{renderEmojis()}</View>
      </ScrollView>
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