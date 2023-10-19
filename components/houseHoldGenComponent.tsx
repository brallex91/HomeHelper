import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { auth, database } from "../database/firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { addHousehold } from "../store/houseHoldSlice";
import { Button, useTheme, TextInput } from 'react-native-paper';

const CreateHousehold = () => {
  const dispatch = useDispatch();
  const [householdName, setHouseholdName] = useState("");

  const theme = useTheme();

  const createHousehold = async () => {
    try {
      const generatedKey = Math.random().toString(36).substring(2, 6);
      const userMockUID = "oYWnfRp0yKWX5fFwG9JxQ6IYppt1";
  
      const userID = auth.currentUser?.uid || userMockUID;
  
      if (!userID) {
        throw new Error("User not authenticated and no mock user ID available");
      }
  
      const householdData = {
        name: householdName,
        key: generatedKey,
        members: [],
        chores: [],
        ownerID: userID,
      };

      if(!householdData.name){
        throw new Error("User not authenticated and no mock user ID available");
      }
  
      const docRef = await addDoc(
        collection(database, "households"),
        householdData,
      );
  
      console.log("Household created with ID:", docRef.id);
  
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
      <Button
        icon='plus-circle-outline'
        mode='contained'
        buttonColor={theme.colors.primary}
        onPress={createHousehold}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Create Household
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonBar: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  button: {
    marginTop: 20,
    marginHorizontal: 4,
    borderColor: 'rgb(242, 242, 242)',
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonLabel: {
    fontSize: 18,
  },
  buttonContent: {
    padding: 8,
  },
});

export default CreateHousehold;
