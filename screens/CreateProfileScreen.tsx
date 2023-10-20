import * as React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";


export default function CreateProfile () {
    

    return (
        <View>
            <Text>Textinput Profilnamn</Text>
            <Text>text: välj avatar</Text>
            <Text> gridlist för avatarbilder</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    cardContainer: {
      marginTop: 10,
    },
    card: {
      marginHorizontal: 10,
      marginVertical: 5,
    },
    userIcons: {
      paddingRight: 20,
    },
    buttonBar: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginBottom: 40,
    },
    button: {
      marginHorizontal: 4,
      borderColor: "rgb(242, 242, 242)",
      borderWidth: 1,
      borderRadius: 20,
    },
    buttonLabel: {
      fontSize: 18,
    },
    buttonContent: {
      padding: 8,
    },
  });