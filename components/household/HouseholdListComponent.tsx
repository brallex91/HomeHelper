import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { collection, doc, getDoc } from 'firebase/firestore';
import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { Button, Card, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import {
  CompletedChore,
  getCompletedChoresByHousehold,
} from '../../api/completedChores';
import { getProfiles } from '../../api/profiles';
import { database } from '../../database/firebaseConfig';
import { setChoreDetails } from '../../store/choreDetailsSlice';
import { Chore } from '../../store/choreSlice';
import { Household } from '../../store/houseHoldSlice';
import { Profile } from '../../store/profileSlice';
import OptionsButton from '../OptionsButton';
import { getHouseholdById } from '../../api/household';

export const emojiMap: Record<string, string> = {
  fox: '🦊',
  pig: '🐷',
  frog: '🐸',
  chick: '🐥',
  octopus: '🐙',
  dolphin: '🐬',
  owl: '🦉',
  unicorn: '🦄',
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
  const theme = useTheme();

  useFocusEffect(
    React.useCallback(() => {
      async function fetchData() {
        try {
          // Await the asynchronous call to getHouseholdById
          const updatedHousehold = await getHouseholdById(household.id);
          
          // Check if updatedHousehold is null or undefined before proceeding
          if (!updatedHousehold) {
            console.error('Failed to fetch updated household data');
            return;
          }
          
          const choresCollection = collection(database, 'chores');
          const choresData: Chore[] = [];
  
          // Use updatedHousehold.chores instead of household.chores
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
    }, [household.id])  // Dependency array updated to include household.id
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
          : '❓';
      })
      .join(' ');
  };

  const navigateToAddNewChore = () => {
    navigation.navigate('AddNewChore', { householdId: household.id });
  };

  const navigateToChoreDetails = (chore: Chore) => {
    dispatch(setChoreDetails(chore));
    navigation.navigate('ChoreDetails');
  };

  const returnToOverview = () => {
    navigation.navigate('HouseholdOverview', { householdId: household.id });
  };

  const BottomButtonBar = () => (
    <View style={styles.buttonBarContainer}>
      <View style={styles.optionsButtonContainer}>
        <OptionsButton size={36} onGoBack={returnToOverview} />
      </View>
      <View style={styles.buttonBar}>
        <Button
          icon='plus-circle-outline'
          mode='contained'
          onPress={navigateToAddNewChore}
          style={styles.button}
          labelStyle={styles.buttonLabel}
          contentStyle={styles.buttonContent}
        >
          Lägg Till
        </Button>
        <Button
          icon='pencil-outline'
          mode='contained'
          onPress={() => console.log('Pressed')}
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
          const avatars = getAvatarsForChore(chore.id);

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
                      <View
                        style={[
                          styles.circle,
                          { backgroundColor: isOverdue ? 'red' : 'lightgrey' },
                        ]}
                      >
                        <Text style={{ color: isOverdue ? 'white' : 'black' }}>
                          {isOverdue ? Math.abs(daysLeft) : daysLeft}
                        </Text>
                      </View>
                      <Text style={styles.userIcons}>{avatars}</Text>
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
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  button: {
    marginHorizontal: 8,
    borderColor: 'rgb(242, 242, 242)',
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
    flexDirection: 'row',
    paddingRight: 5,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
});
