import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { auth, database } from '../database/firebaseConfig';
import { push, ref, set } from 'firebase/database';  

const CreateHousehold = () => {
  const [householdName, setHouseholdName] = useState('');

  const createHousehold = async () => {
    try {
      const generatedKey = Math.random().toString(36).substring(2, 6);

      const householdRef = push(ref(database, 'households'));
      await set(householdRef, {
        name: householdName,
        key: generatedKey,
        members: [],
        chores: [],
        ownerID: auth.currentUser?.uid,
      });

      console.log('Household created:', householdRef.key);  
    } catch (error: any) {
      console.error('Create household error:', error.message);
    }
  };

  return (
    <View>
      <TextInput value={householdName} onChangeText={setHouseholdName} placeholder="Household Name" />
      <Button title="Create Household" onPress={createHousehold} />
    </View>
  );
};

export default CreateHousehold;
