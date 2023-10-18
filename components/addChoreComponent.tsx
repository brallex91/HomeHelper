import React, { useState } from 'react';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { addChore } from '../chore/choreSlice';
import { View } from 'react-native';
import { database } from '../database/firebaseConfig'; 
import { addDoc, collection,} from 'firebase/firestore'; // vet inte varför den inte finns. Men den funkar (addDoc)


const AddChoreComponent = () => {
  const dispatch = useDispatch();
  const [choreData, setChoreData] = useState({
    description: '',
    energyLevel: '',
    frequency: '',
    name: '',
  });

  const handleAddChore = async () => {
  
    const newChore = {
      description: choreData.description,
      energyLevel: choreData.energyLevel,
      frequency: choreData.frequency,
      name: choreData.name,
    };

    try {
      await addDoc(collection(database, 'chores'), newChore);
      console.log(newChore)
      dispatch(addChore(newChore));
      setChoreData({
        description: '',
        energyLevel: '',
        frequency: '',
        name: '',
      });

      
    } catch (error) {
      console.error('Error adding chore to Firestore:', error);
    }
  };

  return (
    <View>
      <TextInput
        label="Description"
        value={choreData.description}
        onChangeText={(text) => setChoreData({ ...choreData, description: text })}
      />
      <TextInput
        label="Energy Level"
        value={choreData.energyLevel}
        onChangeText={(text) => setChoreData({ ...choreData, energyLevel: text })}
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