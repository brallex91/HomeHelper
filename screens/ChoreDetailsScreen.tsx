import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateChoreDetails } from "../store/choreDetailsSlice";
import { useDispatch } from "react-redux";

import { doc, setDoc } from "firebase/firestore";
import { database } from "../database/firebaseConfig";

const ChoreDetailsScreen = () => {
  const chore = useSelector((state: RootState) => state.choreDetails.chore);
  const dispatch = useDispatch();
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
    <View>
      <Text>Id: {chore.id}</Text>
      <TextInput
        placeholder="New Name"
        value={newName}
        onChangeText={(text) => setNewName(text)}
      />
      <TextInput
        placeholder="New Description"
        value={newDescription}
        onChangeText={(text) => setNewDescription(text)}
      />
      <Button title="Save" onPress={handleUpdateChore} />
    </View>
  );
};

export default ChoreDetailsScreen;
