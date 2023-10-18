import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { getAuth, signOut } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      console.log("User logged out");
      navigation.navigate("Login");
    } catch (error: any) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={handleLogout}>
        LogOut
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  button: {
    width: "80%",
  },
});

export default Logout;
