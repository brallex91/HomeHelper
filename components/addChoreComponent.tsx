import { Audio } from "expo-av";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Snackbar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addChore } from "../store/choreSlice";

import { useRoute } from "@react-navigation/native";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { database } from "../database/firebaseConfig";
import NumberSelectionModal from "./NumberSelectionModal";

const AddChoreComponent = () => {
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const route = useRoute();

  const [isFrequencySelectionVisible, setFrequencySelectionVisible] =
    useState(false);
  const [isEnergyLevelSelectionVisible, setEnergyLevelSelectionVisible] =
    useState(false);
  const { householdId } = route.params;
  const dispatch = useDispatch();
  const [choreData, setChoreData] = useState({
    description: "",
    energyLevel: "",
    frequency: "",
    name: "",
    dateCreated: new Date().toISOString(),
    lastCompleted: new Date().toISOString(),
  });

  const handleAddChore = async () => {
    const newChore = {
      description: choreData.description,
      energyLevel: choreData.energyLevel,
      frequency: choreData.frequency,
      name: choreData.name,
      dateCreated: choreData.dateCreated,
      lastCompleted: choreData.lastCompleted,
    };

    try {
      const choreRef = await addDoc(collection(database, "chores"), newChore); // Store the ref of the new chore
      dispatch(addChore(newChore));

      // Update the household's chores array to include the new chore's ID
      const householdRef = doc(database, "households", householdId); // Assume your household collection is named 'households'
      await updateDoc(householdRef, {
        chores: arrayUnion(choreRef.id), // Use arrayUnion to add the new chore ID to the chores array
      });
      console.log(householdId);
      setChoreData({
        description: "",
        energyLevel: "",
        frequency: "",
        name: "",
        dateCreated: new Date().toISOString(),
        lastCompleted: new Date().toISOString(),
      });
      await playCompletionSound();
      setSnackbarMessage(`${newChore.name} Added to Chores!!!`);
      setSnackbarVisible(true);
    } catch (error) {
      console.error("Error adding chore to Firestore:", error);
    }
    console.log("Date created:", choreData.dateCreated);
    console.log("Last completed:", choreData.lastCompleted);
  };

  const playCompletionSound = async () => {
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync(require("../assets/ChoreAdded.mp3"));
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

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Card style={styles.cardName}>
          <TouchableOpacity style={{ width: "100%" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Text style={styles.subtitle}>Titel: </Text>
              <View style={{ flex: 1 }}>
                <TextInput
                  value={choreData.name}
                  style={styles.input}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={(text) =>
                    setChoreData({ ...choreData, name: text })
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
        </Card>

        <Card style={styles.cardDescription}>
          <TouchableOpacity style={{ width: "100%" }}>
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
                  value={choreData.description}
                  style={styles.input}
                  multiline={true}
                  textAlignVertical="top"
                  onChangeText={(text) =>
                    setChoreData({ ...choreData, description: text })
                  }
                />
              </View>
            </View>
          </TouchableOpacity>
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
                  <Text style={styles.frequencyText}>
                    {choreData.frequency}{" "}
                  </Text>
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
                  <Text>{choreData.energyLevel}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>

        <Button mode="contained" onPress={handleAddChore}>
          Lägg till ny chore
        </Button>
      </ScrollView>
      <NumberSelectionModal
        isVisible={isFrequencySelectionVisible}
        closeModal={() => setFrequencySelectionVisible(false)}
        selectNumber={(selectedNumber) =>
          setChoreData({ ...choreData, frequency: selectedNumber.toString() })
        }
      />

      <NumberSelectionModal
        isVisible={isEnergyLevelSelectionVisible}
        closeModal={() => setEnergyLevelSelectionVisible(false)}
        selectNumber={(selectedNumber) =>
          setChoreData({ ...choreData, energyLevel: selectedNumber.toString() })
        }
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        <Text style={styles.snackbarText}>{snackbarMessage}</Text>
      </Snackbar>
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
});

export default AddChoreComponent;
