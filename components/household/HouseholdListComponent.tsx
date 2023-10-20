import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { getChores } from "../../api/chores";
import { setChoreDetails } from "../../store/choreDetailsSlice";

export default function HouseholdListComponent() {
  const dispatch = useDispatch();
  const [chores, setChores] = React.useState<Chore[]>([]);
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateToAddNewChore = () => {
    navigation.navigate("AddNewChore");
  };

  const navigateToChoreDetails = (chore: any) => {
    dispatch(setChoreDetails(chore));
    navigation.navigate("ChoreDetails");
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchChores() {
        try {
          const choresData = await getChores();
          setChores(choresData);
        } catch (error) {
          console.error("Error fetching chores:", error);
        }
      }

      fetchChores();
    }, [])
  );

  const BottomButtonBar = () => (
    <View style={styles.buttonBar}>
      <Button
        icon="plus-circle-outline"
        mode="contained"
        buttonColor={theme.colors.primary}
        onPress={navigateToAddNewChore}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Lägg Till
      </Button>
      <Button
        icon="pencil-outline"
        mode="contained"
        onPress={() => console.log("Pressed")}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Ändra
      </Button>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {chores.map((chore) => (
          <Card key={chore.id} style={styles.card}>
            <Card.Title
              title={chore.name}
              right={(props) => <Text style={styles.userIcons}>🐷</Text>}
            />
            <Button
              mode="contained"
              onPress={() => navigateToChoreDetails(chore)}
            >
              Info
            </Button>
          </Card>
        ))}
      </ScrollView>
      <BottomButtonBar />
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
