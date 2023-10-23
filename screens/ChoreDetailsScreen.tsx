import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, TextInput, Button, useTheme, Card } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateChoreDetails } from "../store/choreDetailsSlice";
import { useDispatch } from "react-redux";

import { doc, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

const ChoreDetailsScreen = () => {
  const chore = useSelector((state: RootState) => state.choreDetails.chore);
  const dispatch = useDispatch();
  const theme = useTheme();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");

  useEffect(() => {
    if (chore) {
      setNewName(chore.name);
      setNewDescription(chore.description);
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
                <Text>Descrition: </Text>
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
              <View style={styles.redCircle}>
                <Text>{chore.frequency}</Text>
              </View>
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Energy Level"
            subtitle="How energy-demanding is the task? "
            right={() => (
              <Text style={{ paddingRight: 20 }}>{chore.energyLevel}</Text>
            )}
          />
        </Card>

        <View style={styles.buttonBar}>
          <Button
            onPress={handleUpdateChore}
            icon="pencil"
            mode="contained"
            buttonColor={theme.colors.primary}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Spara
          </Button>
        </View>
      </ScrollView>
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
    marginRight: 10,
    alignItems: "center",
  },

  buttonBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 300,
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
  cardText: {},
});