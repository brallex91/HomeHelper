import React, { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { addChore } from "../store/choreSlice";
import { View } from "react-native";
import { database } from "../database/firebaseConfig";
import { addDoc, collection } from "firebase/firestore"; // vet inte varför den inte finns. Men den funkar (addDoc)

const AddChoreComponent = () => {
  const dispatch = useDispatch();
  const [choreData, setChoreData] = useState({
    description: "",
    energyLevel: "",
    frequency: "",
    name: "",
    dateCreated: new Date().toISOString() ,
    lastCompleted: new Date().toISOString() 
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
      await addDoc(collection(database, "chores"), newChore);
      dispatch(addChore(newChore)); // Detta funkar ändå. dateCreated som gnäller men får ut datum för tillagd chore
      setChoreData({
        description: "",
        energyLevel: "",
        frequency: "",
        name: "",
        dateCreated: new Date().toISOString(),
        lastCompleted: new Date().toISOString() 
      });
    } catch (error) {
      console.error("Error adding chore to Firestore:", error);
    }
    console.log("Date created:", choreData.dateCreated);
    console.log("Last completed:", choreData.lastCompleted);
  };

  return (
    <View>
      <TextInput
        label="Description"
        value={choreData.description}
        onChangeText={(text) =>
          setChoreData({ ...choreData, description: text })
        }
      />
      <TextInput
        label="Energy Level"
        value={choreData.energyLevel}
        onChangeText={(text) =>
          setChoreData({ ...choreData, energyLevel: text })
        }
        keyboardType="numeric"
      />
      <TextInput
        label="Frequency"
        value={choreData.frequency}
        onChangeText={(text) => setChoreData({ ...choreData, frequency: text })}
        keyboardType="numeric"
      />
      <TextInput
        label="Name"
        value={choreData.name}
        onChangeText={(text) => setChoreData({ ...choreData, name: text })}
      />

      <Button mode="contained" onPress={handleAddChore}>
        Lägg till ny chore
      </Button>
    </View>
  );
};

export default AddChoreComponent;