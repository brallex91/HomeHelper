import { useNavigation } from "@react-navigation/native";
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
import { Button, Card, useTheme } from "react-native-paper";
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
      lastCompleted: new Date().toISOString(),
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

      await addDoc(collection(database, "completedChores"), completedChoreData);
      console.log("Completed chore added to database:", completedChoreData);
    } catch (error) {
      console.error("Error completing chore:", error);
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
                  value={newName}
                  onChangeText={setNewName}
                  style={styles.input}
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
                  value={newDescription}
                  onChangeText={setNewDescription}
                  style={styles.input}
                />
              </View>
            }
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Frequency"
            right={() => (
              <TouchableOpacity
                onPress={() => setFrequencySelectionVisible(true)}
              >
                <View style={styles.frequency}>
                  <Text>{newFrequency} days</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="Energy Level"
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
          Save Changes
        </Button>
        <Button
          icon="check"
          mode="contained"
          onPress={handleCompleteChore}
          style={styles.button}
        >
          Mark as Complete
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
  input: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  frequency: {
    marginRight: 10,
    padding: 6,
    backgroundColor: "#ddd",
    borderRadius: 10,
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
});

export default ChoreDetailsScreen;
