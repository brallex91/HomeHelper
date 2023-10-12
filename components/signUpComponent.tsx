import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { auth, database } from '../database/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const register = async () => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        // Create a new user record in the Realtime Database
        await set(ref(database, 'users/' + user.uid), {
          id: user.uid,
          name: '',
          email: email,
          avatar: '',
        });
  
        console.log('User registered:', user.email);
      } catch (error: any) {
        console.error('Registration error:', error.message);
      }
    };
  
    return (
      <View>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Button title="Register" onPress={register} />
      </View>
    );
  };
  
    export default Register;