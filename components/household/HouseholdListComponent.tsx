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

export default function HouseholdListComponent({ household }: HouseholdListComponentProps) {
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

  
  const getDaysLeftToDoChore = (lastCompleted: Date, interval: number) => {
    // Skapar en ny datumobjekt baserat på när uppgiften senast utfördes.
    const nextDueDate = new Date(lastCompleted);
    
    // Lägger till intervallet (i dagar) till det senaste utförda datumet för att få nästa datum då uppgiften ska utföras.
    nextDueDate.setDate(lastCompleted.getDate() + interval);
    
    // Skapar ett nytt datumobjekt för nuvarande tidpunkt.
    const dateNow = new Date();
    
    // Räknar ut tidsdifferensen (i millisekunder) mellan nästa utförda datum och nuvarande tidpunkt.
    const timeDifference = nextDueDate.getTime() - dateNow.getTime();
    
    // Omvandlar tidsdifferensen från millisekunder till dagar.
    const daysLeft = timeDifference / (1000 * 60 * 60 * 24);
    
    // Returnerar tidsdifferensen avrundad uppåt (eftersom vi vill ha hela dagar).
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
          const daysLeft = validLastCompletedDate ? getDaysLeftToDoChore(new Date(validLastCompletedDate),chore.frequency): null;
          const isOverdue = daysLeft !== null && daysLeft <= 0;

          return (
            <TouchableWithoutFeedback
              key={chore.id}
              onPress={() => navigateToChoreDetails(chore)}
            >
              <Card style={styles.card}>
                <Card.Title
                  title={chore.name}
                  left={(props) => (
                    <>
                      <Text style={isOverdue ? { color: "red" } : {}}>
                        {isOverdue ? ` ${Math.abs(daysLeft)} ` : `${daysLeft} `}
                      </Text>
                    </>
                  )}
                  right={(props) => <Text style={styles.userIcons}>🐷</Text>}
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
});
