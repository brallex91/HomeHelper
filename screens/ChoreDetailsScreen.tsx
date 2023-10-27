import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import {
  Text,
  TextInput,
  Button,
  useTheme,
  Card,
  Checkbox,
} from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateChoreDetails } from "../store/choreDetailsSlice";
import { useDispatch } from "react-redux";
import NumberSelectionModal from "../components/NumberSelectionModal";
import { doc, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";
import { useNavigation } from "@react-navigation/native";

const ChoreDetailsScreen = () => {
  const navigation = useNavigation();
  const chore = useSelector((state: RootState) => state.choreDetails.chore);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newFrequency, setNewFrequency] = useState(chore?.frequency || 1);
  const [newEnergyLevel, setNewEnergyLevel] = useState(chore?.energyLevel || 1);
  // const [lastCompletedChore, setLastCompletedChore] = useState(false);
  const [isFrequencySelectionVisible, setFrequencySelectionVisible] =
    useState(false);
  const [isEnergyLevelSelectionVisible, setEnergyLevelSelectionVisible] =
    useState(false);

  useEffect(() => {
    if (chore) {
      setNewName(chore.name);
      setNewDescription(chore.description);
      setNewFrequency(chore.frequency);
      setNewEnergyLevel(chore.energyLevel);
      navigation.setOptions({ title: chore.description });
    }
  }, [chore]);

  const handleUpdateChore = async () => {
    if (!chore) {
      return;
    }
  
    const updatedChore = {
      ...chore,
      name: newName,
      description: newDescription,
      frequency: newFrequency,
      energyLevel: newEnergyLevel,
      lastCompleted: new Date().toISOString() // Always update lastCompleted
    };
  
    try {
      const choreRef = doc(database, "chores", chore.id);
      await setDoc(choreRef, updatedChore);
      console.log("Chore updated in Firestore.");
      dispatch(updateChoreDetails(updatedChore));
    } catch (error) {
      console.error("Error updating chore in Firestore:", error);
    }
  };

  if (!chore) {
    return <Text>No chore selected.</Text>;
  }

  const openFrequencySelectionModal = () => {
    setFrequencySelectionVisible(true);
  };

  const closeFrequencySelectionModal = () => {
    setFrequencySelectionVisible(false);
  };

  const openEnergyLevelSelectionModal = () => {
    setEnergyLevelSelectionVisible(true);
  };

  const closeEnergyLevelSelectionModal = () => {
    setEnergyLevelSelectionVisible(false);
  };

  const selectFrequency = (number: number) => {
    setNewFrequency(number);
    closeFrequencySelectionModal();
  };

  const selectEnergyLevel = (number: number) => {
    setNewEnergyLevel(number);
    closeEnergyLevelSelectionModal();
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Title
            title={
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Name: </Text>
                <TextInput
                  mode="outlined"
                  value={newName}
                  onChangeText={(text) => setNewName(text)}
                  style={{ width: 250, height: 40 }}
                />
              </View>
            }
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title={
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>Description: </Text>
                <TextInput
                  mode="outlined"
                  value={newDescription}
                  onChangeText={(text) => setNewDescription(text)}
                  style={{ width: 150, height: 40 }}
                />
              </View>
            }
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Frequency"
            right={() => (
              <TouchableOpacity onPress={openFrequencySelectionModal}>
                <View style={styles.textRow}>
                  <Text>var</Text>
                  <View style={styles.redCircle}>
                    <Text style={{ color: "white" }}>{newFrequency}</Text>
                  </View>
                  <Text>dag</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Energy Level"
            subtitle="How energy-demanding is the task?"
            right={() => (
              <TouchableOpacity onPress={openEnergyLevelSelectionModal}>
                <View style={styles.greyCircle}>
                  <Text>{newEnergyLevel}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>
        <View style={styles.buttomRow}>
          <View style={styles.buttonBar}>
            <Button
              onPress={handleUpdateChore}
              icon="pencil"
              mode="contained"
              color={theme.colors.primary}
              style={styles.button}
              labelStyle={styles.buttonLabel}
              contentStyle={styles.buttonContent}
            >
              Save
            </Button>
          </View>
          {/* <View style={styles.checkbox}>
            <Card style={styles.card}>

            <Checkbox.Item
              label="Marked as finished"
              status={lastCompletedChore ? "checked" : "unchecked"}
              color="green"
              onPress={() => {
                setLastCompletedChore(!lastCompletedChore);
              }}
              />
              </Card>
          </View> */}
        </View>
      </ScrollView>

      <NumberSelectionModal
        isVisible={isFrequencySelectionVisible}
        closeModal={closeFrequencySelectionModal}
        selectNumber={selectFrequency}
      />

      <NumberSelectionModal
        isVisible={isEnergyLevelSelectionVisible}
        closeModal={closeEnergyLevelSelectionModal}
        selectNumber={selectEnergyLevel}
      />
    </View>
  );
};

export default ChoreDetailsScreen;

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    marginTop: 10,
  },
  card: {
    marginHorizontal: 10,
    marginVertical: 5,
  },

  redCircle: {
    width: 20,
    height: 20,
    backgroundColor: "red",
    borderRadius: 10,
    alignItems: "center",
  },
  greyCircle: {
    width: 20,
    height: 20,
    backgroundColor: "lightgrey",
    borderRadius: 10,
    alignItems: "center",
    marginRight: 20,
  },
  buttomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  checkbox: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    marginHorizontal: 4,
    borderColor: "rgb(242, 242, 242)",
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonContent: {
    padding: 8,
  },
  textRow: {
    flexDirection: "row",
    gap: 10,
    marginRight: 10,
  },
});