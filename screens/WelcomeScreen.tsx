import React from "react";
import { View, StyleSheet } from "react-native";
import { Button,} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const navigateToSignUp = () => {
    navigation.navigate("Register");
  };

  const navigateToLogin = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.buttonContainer}>
      <Button
        mode="contained"
        buttonColor="green"
        onPress={navigateToLogin}
        style={styles.button}
      >
        Login
      </Button>
      <Button
        mode="contained"
        buttonColor="blue"
        onPress={navigateToSignUp}
        style={styles.button}
      >
        Sign Up
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  button: {
    width: "80%",
  },
});
