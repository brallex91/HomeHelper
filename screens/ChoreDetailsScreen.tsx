import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  useTheme,
} from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import NumberSelectionModal from "../components/NumberSelectionModal";
import { auth, database } from "../database/firebaseConfig";
import { updateChoreDetails } from "../store/choreDetailsSlice";
import { RootState } from "../store/store";

const ChoreDetailsScreen = () => {
  const navigation = useNavigation();
  const chore = useSelector((state: RootState) => state.choreDetails.chore);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [newName, setNewName] = useState(chore?.name || "");
  const [newDescription, setNewDescription] = useState(
    chore?.description || ""
  );
  const [newFrequency, setNewFrequency] = useState(chore?.frequency || 1);
  const [newEnergyLevel, setNewEnergyLevel] = useState(chore?.energyLevel || 1);
  const [isFrequencySelectionVisible, setFrequencySelectionVisible] =
    useState(false);
  const [isEnergyLevelSelectionVisible, setEnergyLevelSelectionVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);

  useEffect(() => {
    if (chore) {
      setNewName(chore.name);
      setNewDescription(chore.description);
      setNewFrequency(chore.frequency);
      setNewEnergyLevel(chore.energyLevel);
      navigation.setOptions({ title: chore.name });
    }
  }, [chore, navigation]);

  const handleUpdateChore = async () => {
    if (!chore) return;

    const updatedChore = {
      ...chore,
      name: newName,
      description: newDescription,
      frequency: newFrequency,
      energyLevel: newEnergyLevel,
    };

    const choreRef = doc(database, "chores", chore.id);

    try {
      await updateDoc(choreRef, updatedChore);
      dispatch(updateChoreDetails(updatedChore));
    } catch (error) {
      console.error("Error updating chore:", error);
    }
  };

  const handleCompleteChore = async () => {
    console.log("Starting handleCompleteChore...");

    if (!chore) {
      console.log("No chore found");
      return;
    }

    const userId = auth.currentUser?.uid;
    if (!userId) {
      console.log("No user ID found");
      return;
    }
    console.log(`User ID: ${userId}`);

    try {
      setIsLoading(true);
      const householdQuery = query(
        collection(database, "households"),
        where("chores", "array-contains", chore.id)
      );
      const householdSnapshot = await getDocs(householdQuery);

      if (householdSnapshot.empty) {
        console.log("No household found containing the chore");
        return;
      }

      const household = householdSnapshot.docs[0].data();
      const householdId = householdSnapshot.docs[0].id;
      console.log(`Household ID: ${householdId}`, household);

      const userProfilesQuery = query(
        collection(database, "profiles"),
        where("userId", "==", userId)
      );
      const userProfilesSnapshot = await getDocs(userProfilesQuery);
      console.log(
        `Found profiles for user: ${userProfilesSnapshot.docs.length}`
      );

      const userProfile = userProfilesSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .find((prof) => household.members.includes(prof.id));

      if (!userProfile) {
        console.log("No matching profile found for the user in this household");
        return;
      }
      console.log("Matching profile ID:", userProfile.id);

      const completedChoreData = {
        choreId: chore.id,
        date: new Date().toISOString(),
        profileId: userProfile.id,
        householdId: householdId,
      };
      await Promise.all([
        addDoc(collection(database, "completedChores"), completedChoreData),
      ]);
      shootConfetti();
      playCompletionSound(), setSnackbarVisible(true);
      setIsLoading(false);
      console.log("Completed chore added to database:", completedChoreData);
    } catch (error) {
      console.error("Error completing chore:", error);
    }
  };

  if (!chore) {
    return <Text>No chore selected.</Text>;
  }

  const playCompletionSound = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require("../assets/ChoreCompleted.mp3"));
      await sound.playAsync();

      sound.setOnPlaybackStatusUpdate(async (status) => {
        if (status.isLoaded && status.didJustFinish) {
          await sound.unloadAsync();
        }
      });
    } catch (error) {
      console.error("Failed to play completion sound", error);
    }
  };

  const shootConfetti = () => {
    setConfettiVisible(true);
    setTimeout(() => {
      setConfettiVisible(false);
    }, 3500);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text>Completing {chore.name}!!!</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Card style={styles.cardName}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Text style={styles.subtitle}>Titel: </Text>
            <View>
              <TextInput
                value={newName}
                onChangeText={setNewName}
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          </View>
        </Card>

        <Card style={styles.cardDescription}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            <Text style={styles.subtitle}>Beskrivning: </Text>
            <View style={{ flex: 1 }}>
              <TextInput
                value={newDescription}
                onChangeText={setNewDescription}
                style={styles.input}
                multiline={true}
                textAlignVertical="top"
              />
            </View>
          </View>
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Återkommer:"
            right={() => (
              <TouchableOpacity
                onPress={() => setFrequencySelectionVisible(true)}
              >
                <View style={styles.frequencyContainer}>
                  <Text style={styles.text}>var</Text>
                  <Text style={styles.frequencyText}>{newFrequency} </Text>
                  <Text style={styles.text}>dag</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Värde:"
            right={() => (
              <TouchableOpacity
                onPress={() => setEnergyLevelSelectionVisible(true)}
              >
                <View style={styles.energyLevel}>
                  <Text>{newEnergyLevel}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>
        <Button
          icon="content-save"
          mode="contained"
          onPress={handleUpdateChore}
          style={styles.button}
        >
          Spara
        </Button>
        <Button
          icon="check"
          mode="contained"
          onPress={handleCompleteChore}
          style={styles.button}
        >
          Markera som klar
        </Button>
      </ScrollView>
      <NumberSelectionModal
        isVisible={isFrequencySelectionVisible}
        closeModal={() => setFrequencySelectionVisible(false)}
        selectNumber={setNewFrequency}
      />
      <NumberSelectionModal
        isVisible={isEnergyLevelSelectionVisible}
        closeModal={() => setEnergyLevelSelectionVisible(false)}
        selectNumber={setNewEnergyLevel}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        <Text style={styles.snackbarText}>{chore.name} Completed!!!</Text>
      </Snackbar>
      {confettiVisible && (
        <ConfettiCannon
          count={200}
          origin={{ x: -10, y: 0 }}
          autoStart={true}
          explosionSpeed={350}
          fallSpeed={2500}
          colors={["#ff0", "#f00", "#00f", "#0f0"]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    padding: 10,
  },
  card: {
    marginVertical: 8,
  },
  cardName: {
    width: "100%",
    height: "10%",
  },
  cardDescription: {
    flex: 1,
    marginVertical: 8,
    width: "100%",
    height: 100,
  },
  input: {
    flex: 1,
    width: "100%",
    minHeight: 80,
    maxHeight: 500,
    padding: 2,
    borderRadius: 5,
  },
  frequencyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  text: {
    marginRight: 5,
  },
  frequencyText: {
    marginRight: 5,
    paddingLeft: 5,
    paddingRight: 2,
    padding: 1,
    backgroundColor: "red",
    borderRadius: 15,
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    position: "relative",
    fontSize: 14,
    color: "gray",
    marginLeft: 5,
  },

  energyLevel: {
    marginRight: 10,
    padding: 6,
    backgroundColor: "#ddd",
    borderRadius: 10,
  },
  button: {
    marginVertical: 10,
  },
  snackbar: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "green",
    justifyContent: "center",
  },
  snackbarText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChoreDetailsScreen;
