import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text, Checkbox, Button, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Login from "../components/loginComponent";
import Register from "../components/signUpComponent";
import CreateHousehold from "../components/houseHoldGenComponent";

export default function LoginScreen() {
  const [checked, setChecked] = useState(false);
  const navigation = useNavigation();

  const toggleCheckbox = () => {
    setChecked(!checked);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>
        Logga in för att se en app där man kan skriva sina hemligheter
      </Text>
      <Login />
      <Register />
      <CreateHousehold />
      <View style={styles.inputsContainer}>
        <TextInput label="Username" />
        <TextInput label="Password" secureTextEntry />

        <View style={styles.checkboxContainer}>
          <Checkbox.Item
            label="Remember me"
            color="orange"
            status={checked ? "checked" : "unchecked"}
            onPress={toggleCheckbox}
          />
          <Text>Forgot Password</Text>
        </View>
      </View>

      <Button
        buttonColor="green"
        mode="contained"
        onPress={() => navigation.navigate("Hushållet")} /// har lagt till detta så vi kan ta oss till startsidan.
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },

  topText: {
    flex: 1,
    margin: 16,
    fontSize: 16,
  },

  inputsContainer: {
    flex: 1,
    width: "80%",
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
