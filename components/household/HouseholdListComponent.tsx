import { useFocusEffect,  useNavigation } from "@react-navigation/native";
import { collection, doc, getDoc } from "firebase/firestore";
import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Card, useTheme } from "react-native-paper";
import { useDispatch } from "react-redux";
import {
  CompletedChore,
  getCompletedChoresByHousehold,
} from "../../api/completedChores";
import { getProfiles } from "../../api/profiles";
import { database } from "../../database/firebaseConfig";
import { setChoreDetails } from "../../store/choreDetailsSlice";
import { Chore } from "../../store/choreSlice";
import { Household } from "../../store/houseHoldSlice";
import { Profile } from "../../store/profileSlice";
import OptionsButton from "../OptionsButton";
import { getHouseholdById } from "../../api/household";

export const emojiMap: Record<string, string> = {
  fox: "🦊",
  pig: "🐷",
  frog: "🐸",
  chick: "🐥",
  octopus: "🐙",
  dolphin: "🐬",
  owl: "🦉",
  unicorn: "🦄",
};

interface HouseholdListComponentProps {
  household: Household;
}

export default function HouseholdListComponent({
  household,
}: HouseholdListComponentProps) {
  const dispatch = useDispatch();
  const [chores, setChores] = React.useState<Chore[]>([]);
  const [completedChores, setCompletedChores] = React.useState<
    CompletedChore[]
  >([]);
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const navigation = useNavigation();


  const [currentDay, setCurrentDay] = React.useState<number>(
    new Date().getDate()
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          // Fetch the updated household data
          const updatedHousehold = await getHouseholdById(household.id);
          
          if (!updatedHousehold) {
            console.error('Failed to fetch updated household data');
            return;
          }
          
          const choresCollection = collection(database, 'chores');
          const choresData: Chore[] = [];
          
          for (const choreId of updatedHousehold.chores) {
            const choreRef = doc(choresCollection, choreId);
            const choreDoc = await getDoc(choreRef);
            if (choreDoc.exists()) {
              const chore = { id: choreDoc.id, ...choreDoc.data() } as Chore;
              choresData.push(chore);
            }
          }
  
          setChores(choresData);
          const fetchedCompletedChores = await getCompletedChoresByHousehold(updatedHousehold.id);
          setCompletedChores(fetchedCompletedChores);
          const fetchedProfiles = await getProfiles();
          setProfiles(fetchedProfiles);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
  
      fetchData();
  
      // Re-fetch data every hour or if the day changes
      const intervalId = setInterval(() => {
        const today = new Date().getDate();
        if (today !== currentDay) {
          setCurrentDay(today);
          fetchData();
        }
      }, 1000 * 60 * 60);
      
      // Clean up interval when component is unmounted or loses focus
      return () => clearInterval(intervalId);
  
    }, [household.id, currentDay])  // Dependency array includes both household.id and currentDay
  );


  const getDaysLeftToDoChore = (
    lastCompleted: Date | null,
    frequency: number
  ) => {
    let referenceDate = lastCompleted || new Date();
    const nextDueDate = new Date(referenceDate);
    nextDueDate.setTime(
      referenceDate.getTime() + frequency * 24 * 60 * 60 * 1000
    );
    const dateNow = new Date();
    const timeDifference = nextDueDate.getTime() - dateNow.getTime();
    const daysLeft = timeDifference / (1000 * 60 * 60 * 24);
    return Math.ceil(daysLeft);
  };

  const getAvatarsForChore = (choreId: string): string => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return completedChores
      .filter((c) => {
        const completedDate = new Date(c.date);
        completedDate.setHours(0, 0, 0, 0);
        return (
          c.choreId === choreId && completedDate.getTime() === today.getTime()
        );
      })
      .map((c) => {
        const profile = profiles.find((p) => p.id === c.profileId);
        return profile && emojiMap[profile.avatar as keyof typeof emojiMap]
          ? emojiMap[profile.avatar as keyof typeof emojiMap]
          : "❓";
      })
      .join(" ");
  };

  const navigateToAddNewChore = () => {
    navigation.navigate("AddNewChore", { householdId: household.id });
  };

  const navigateToChoreDetails = (chore: Chore) => {
    dispatch(setChoreDetails(chore));
    navigation.navigate("ChoreDetails");
  };

  const goBack = () => {
    navigation.goBack();
  };

  const BottomButtonBar = () => (
    <View style={styles.buttonBarContainer}>
      <View style={styles.optionsButtonContainer}>
        <OptionsButton size={36} onGoBack={goBack} />
      </View>
      <View style={styles.buttonBar}>
        <Button
          icon="plus-circle-outline"
          mode="contained"
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
          style={[styles.button, { marginLeft: 8 }]}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          Ändra
        </Button>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {chores.map((chore) => {
          
          const daysLeft = chore.lastCompleted
            ? getDaysLeftToDoChore(
                new Date(chore.lastCompleted),
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
                    <View style={styles.dueDateContainer}>
                      {getAvatarsForChore(chore.id) ? (
                        <Text style={styles.userIcons}>
                          {getAvatarsForChore(chore.id)}
                        </Text>
                      ) : (
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
                      )}
                    </View>
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
    fontSize: 28,
    letterSpacing: -6,
  },
  buttonBarContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  optionsButtonContainer: {
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  buttonBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  button: {
    marginHorizontal: 8,
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
