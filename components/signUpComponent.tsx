import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { auth, database } from "../database/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Create a new user record in the Realtime Database
      await set(ref(database, "users/" + user.uid), {
        id: user.uid,
        name: "",
        email: email,
        avatar: "",
      });

      console.log("User registered:", user.email);
    } catch (error: any) {
      console.error("Registration error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button
        mode="contained"
        onPress={register}
        buttonColor="white"
        style={styles.button}
      >
        Lägg till
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    gap: 20,
  },
  button: {
    justifyContent: "flex-start",
    width: "40%",
  },
});

export default Register;
