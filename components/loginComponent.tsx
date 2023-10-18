import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import { auth } from "../database/firebaseConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          console.log("User logged in:", user.email);
          navigation.navigate("HouseholdOverview");
        },
      );
    } catch (error: any) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
        />
        <Checkbox.Item
          label="Remember me"
          color="black"
          status={checked ? "checked" : "unchecked"}
          onPress={toggleCheckbox}
        />
      </View>
      <Button
        buttonColor="green"
        mode="contained"
        onPress={login}
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  topText: {
    flex: 1,
    margin: 16,
    fontSize: 16,
  },

  inputContainer: {
    flex: 1,
    width: "80%",
    justifyContent: "center",
    gap: 20,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    marginBottom: 100,
    width: "80%",
  },
});

export default Login;
