import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, useTheme } from 'react-native-paper';
import { useDispatch } from "react-redux";
import { auth, database } from "../database/firebaseConfig";
import { RootStackParamList } from "../navigation/RootNavigator";
import { addHousehold } from "../store/houseHoldSlice";

type Props = NativeStackScreenProps<RootStackParamList, 'AddNewHousehold'>;

const CreateHousehold = ({ navigation, route }: Props) => {
  const dispatch = useDispatch();
  const [householdName, setHouseholdName] = useState("");
  const theme = useTheme();

  const createHousehold = async () => {
    console.log(navigation);
    try {
      const generatedKey = Math.random().toString(36).substring(2, 6);
      const userID = auth.currentUser?.uid;
  
      if (!userID) {
        throw new Error("User not authenticated and no mock user ID available");
      }
  
      const household = {
        name: householdName,
        key: generatedKey,
        members: [],
        chores: [],
        ownerID: userID,
        userId: []
      };

      if(!household.name){
        throw new Error("User not authenticated and no mock user ID available");
      }
  
      const docRef = await addDoc(
        collection(database, "households"),
        household,
      );
  
      console.log("Household created with ID:", docRef.id);  
      dispatch(addHousehold({ ...household, id: docRef.id }));
      
      // Navigate to the CreateProfileComponent screen, passing the household object as a parameter
      navigation.navigate('CreateProfileScreen', { household: { ...household, id: docRef.id } });
      console.log("Sendinghousehold:",  household);
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
