import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { auth, database } from "../database/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addHousehold } from "../store/houseHoldSlice";

const CreateHousehold = () => {
  const dispatch = useDispatch();
  const [householdName, setHouseholdName] = useState("");

  const createHousehold = async () => {
    try {
      const generatedKey = Math.random().toString(36).substring(2, 6);

      if (!auth.currentUser || !auth.currentUser.uid) {
        throw new Error("User not authenticated");
      }

      const householdData = {
        name: householdName,
        key: generatedKey,
        members: [],
        chores: [],
        ownerID: auth.currentUser.uid, // Now ownerID is guaranteed to be a string
      };

      const docRef = await addDoc(
        collection(database, "households"),
        householdData,
      );

      console.log("Household created with ID:", docRef.id);

      // Dispatch the addHousehold action with the new household data
      dispatch(addHousehold({ ...householdData, id: docRef.id }));
    } catch (error: any) {
      console.error("Create household error:", error.message);
    }
  };

  return (
    <View>
      <TextInput
        value={householdName}
        onChangeText={setHouseholdName}
        placeholder="Household Name"
      />
      <Button title="Create Household" onPress={createHousehold} />
    </View>
  );
};

export default CreateHousehold;
