import { useFocusEffect, useNavigation } from "@react-navigation/native";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import { setChoreDetails } from "../../store/choreDetailsSlice";
import { Chore } from "../../store/choreSlice";
import { Household } from "../../store/houseHoldSlice";
import { collection, doc, getDoc } from "firebase/firestore";
import { database } from "../../database/firebaseConfig";

interface HouseholdListComponentProps {
  household: Household;
}

export default function HouseholdListComponent({
  household,
}: HouseholdListComponentProps) {
  const dispatch = useDispatch();
  const [chores, setChores] = React.useState<Chore[]>([]);
  const navigation = useNavigation();
  const theme = useTheme();

  const navigateToAddNewChore = () => {
    navigation.navigate("AddNewChore", { householdId: household.id });
  };

  const navigateToChoreDetails = (chore: any) => {
    dispatch(setChoreDetails(chore));
    navigation.navigate("ChoreDetails");
  };

  useFocusEffect(
    React.useCallback(() => {
      async function fetchChores() {
        try {
          const choresCollection = collection(database, "chores");
          const choresData: Chore[] = [];

          for (const choreId of household.chores) {
            const choreRef = doc(choresCollection, choreId);
            const choreDoc = await getDoc(choreRef);
            if (choreDoc.exists()) {
              const chore = { id: choreDoc.id, ...choreDoc.data() } as Chore;
              choresData.push(chore);
            }
          }

          setChores(choresData);
        } catch (error) {
          console.error("Error fetching chores:", error);
        }
      }

      fetchChores();
    }, [household.chores])
  );

  const getDaysLeftToDoChore = (lastCompleted: Date, frequency: number) => {
    const nextDueDate = new Date(lastCompleted);
    nextDueDate.setTime(
      lastCompleted.getTime() + frequency * 24 * 60 * 60 * 1000
    );

    const dateNow = new Date();
    const timeDifference = nextDueDate.getTime() - dateNow.getTime();
    const daysLeft = timeDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysLeft);
  };

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
        {chores.map((chore) => {
          const validLastCompletedDate = chore.lastCompleted;
          const daysLeft = validLastCompletedDate
            ? getDaysLeftToDoChore(
                new Date(validLastCompletedDate),
                chore.frequency
              )
            : null;
          const isOverdue = daysLeft !== null && daysLeft <= 0;

          return (
            <TouchableWithoutFeedback
              key={chore.id}
              onPress={() => navigateToChoreDetails(chore)}
            >
              <Card style={styles.card}>
                <Card.Title
                  title={chore.name}
                  right={(props) => (
                    <>
                      <View style={styles.dueDateContainer}>
                        <View
                          style={[
                            styles.circle,
                            {
                              backgroundColor: isOverdue ? "red" : "lightgrey",
                            },
                          ]}
                        >
                          <Text
                            style={{ color: isOverdue ? "white" : "black" }}
                          >
                            {isOverdue ? Math.abs(daysLeft) : daysLeft}
                          </Text>
                        </View>
                        <Text style={styles.userIcons}>🐷</Text>
                      </View>
                    </>
                  )}
                />
              </Card>
            </TouchableWithoutFeedback>
          );
        })}
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
  dueDateContainer: {
    flexDirection: "row",
    paddingRight: 5,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
});
