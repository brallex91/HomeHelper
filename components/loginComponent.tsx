import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { auth } from '../database/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const login = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user;
                console.log('User logged in:', user.email);
        });
      } catch (error: any) {
        console.error('Login error:', error.message);
      }
    };
  
    return (
      <View>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
        <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
        <Button title="Login" onPress={login} />
      </View>
    );
  };

  export default Login;