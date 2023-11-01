import { useFocusEffect } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Text, TextInput, useTheme } from "react-native-paper";
import { getHouseholdById } from "../api/household";
import { addProfile, getProfileById } from "../api/profiles";
import { useGlobalContext } from "../context/context";
import { auth, database } from "../database/firebaseConfig";
import { RootStackParamList } from "../navigation/RootNavigator";
import { Profile, ProfileCreate } from "../store/profileSlice";
import { EmojiKeys, emojiMap } from "./HouseholdElementOverviewScreen";

const userID = auth.currentUser?.uid;
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

const convertEmojiToString = (emoji: string) => {
  switch (emoji) {
    case "🦊":
      return "fox";
    case "🐷":
      return "pig";
    case "🐸":
      return "frog";
    case "🐥":
      return "chick";
    case "🐙":
      return "octopus";
    case "🐬":
      return "dolphin";
    case "🦉":
      return "owl";
    case "🦄":
      return "unicorn";
    default:
      return "";
  }
};

type Props = NativeStackScreenProps<RootStackParamList, 'CreateProfileScreen'>

const CreateProfileComponent = ({ navigation, route }: Props) => {
  const userID = auth.currentUser?.uid;
  const { currentHousehold, setCurrentHousehold } = useGlobalContext();
  const theme = useTheme();
  const { household } = route.params;
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji>();
  const [profileData, setProfileData] = useState<ProfileCreate>({
    name: "",
    avatar: "",
    userId: userID
  });
  const [emojiColor, setEmojiColor] = useState("#000000");
  const [isLoading, setIsLoading] = useState(true);
  const [unavailableEmojis, setUnavailableEmojis] = useState<string[]>([]);

  const fetchData = async () => {

    let memberIdArray: string[] = [];
    let fetchedProfiles: (Profile | null)[] = [];
    let unavailableEmojis: string[] = [];

    try {
      const house = await getHouseholdById(currentHousehold);
      if (house && house.members) {

        memberIdArray = [...house.members];

        const profilePromises: Promise<Profile | null>[] = memberIdArray.map(member => getProfileById(member));

        fetchedProfiles = await Promise.all(profilePromises);
        const newUnavailableEmojis: string[] = fetchedProfiles
          .map(member => member?.avatar)
          .filter((avatar): avatar is Emoji => avatar !== undefined)
          .map(avatar => emojiMap[avatar as EmojiKeys]);

        setUnavailableEmojis(newUnavailableEmojis);
      }
    } catch (error) {
      console.error("Error fetching data from Firebase: ", error);
    }
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
      return () => {

      };
    }, [])
  );

  const handleEmojiClick = (emoji: Emoji) => {
    setSelectedEmoji(emoji);
    setEmojiColor(getColorForEmoji(emoji));
    setProfileData((prevData) => ({
      ...prevData,
      avatar: emoji,
    }));
  };
  const handleButtonPress = async () => {
    const avatarString = convertEmojiToString(profileData.avatar);
    const profileDoc = await addProfile({ ...profileData, avatar: avatarString });
    const householdRef = doc(database, 'households', household.id);
    await updateDoc(householdRef, {
      members: arrayUnion(profileDoc.id),
      userId: arrayUnion(userID)
    });
    navigation.navigate("HouseholdChores", route.params);
  };

  const renderEmojis = () => {
    const availableEmojis = emojis.filter(emoji => !unavailableEmojis.includes(emoji));

    return availableEmojis.map((emoji, index) => (
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
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <TextInput
            value={profileData.name}
            style={styles.textinput}
            onChangeText={(text) =>
              setProfileData({ ...profileData, name: text })
            }
            placeholder="Profilnamn"
          />
          <ScrollView>
            <View style={styles.emojiList}>{renderEmojis()}</View>
          </ScrollView>
          <Button style={styles.button} onPress={() => handleButtonPress()}>
            Skapa Profil
          </Button>
        </>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default CreateProfileComponent;