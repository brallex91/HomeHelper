import React from 'react';
import { View, FlatList, Text, StyleSheet, TouchableWithoutFeedback, TextInput } from 'react-native'; 
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Card, Button } from 'react-native-paper';
import { auth } from '../database/firebaseConfig';
import { updateApiHousehold } from '../api/household';
import { getProfiles } from '../api/profiles';

type RootStackParamList = {
  HouseholdElementOverviewScreen: { household: Household };
};

type HouseholdElementOverviewScreenRouteProp = RouteProp<RootStackParamList, 'HouseholdElementOverviewScreen'>;

export type EmojiKeys = 'fox' | 'pig' | 'frog' | 'chick' | 'octopus' | 'dolphin' | 'owl' | 'unicorn';

export const emojiMap: Record<EmojiKeys, string> = {
  fox: '🦊',
  pig: '🐷',
  frog: '🐸',
  chick: '🐥',
  octopus: '🐙',
  dolphin: '🐬',
  owl: '🦉',
  unicorn: '🦄'
};

export default function HouseholdElementOverviewScreen () {
  const route = useRoute<HouseholdElementOverviewScreenRouteProp>();
  const navigation = useNavigation();
  const { household } = route.params;
  const userMockUID = "oYWnfRp0yKWX5fFwG9JxQ6IYppt1";
  const userID = auth.currentUser?.uid || userMockUID;
  const [profiles, setProfiles] = React.useState<Profile[]>([]);
  const [isOwner, setIsOwner] = React.useState(false);
  const [newHouseholdName, setNewHouseholdName] = React.useState("");


  

  React.useEffect(() => {
    async function checkOwnership() {
      setIsOwner(userID === household.ownerID);
    }
    async function fetchProfiles() {
      const profilesData = await getProfiles();
      setProfiles(profilesData);
    }

    checkOwnership();
    fetchProfiles();
  }, [household.ownerID]);

  async function handleNameChange() {
    household.name = newHouseholdName;
    await updateApiHousehold(household);
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <Card style={{ marginBottom: 16 }}>
          <Card.Title title={household.name} subtitle={`Key: ${household.key}`} />
        </Card>
      </View>
  
      <FlatList
        contentContainerStyle={styles.cardContainer}
        data={household.members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const profile = profiles.find(profile => profile.id === item);
          let emoji: string | undefined;
          if (profile && profile.avatar && emojiMap[profile.avatar as EmojiKeys]) {
            emoji = emojiMap[profile.avatar as EmojiKeys];
          }
          return (
            <Card style={styles.card}>
              <Card.Title
                title={profile?.name}
                right={(props) => (
                  <Text style={styles.userIcons}>{emoji}</Text>
                )}
              />
            </Card>
          );
        }}
        />
        {isOwner && (
        <View style={{ padding: 16 }}>
          <TextInput
            value={newHouseholdName}
            onChangeText={setNewHouseholdName}
            placeholder="New Household Name"
            style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 8, padding: 8 }}
          />
          <Button 
            mode="contained" 
            onPress={handleNameChange}
            style={styles.button}
          >
            Change Name
          </Button>
        </View>
      )}
        <Button 
        mode="contained" 
        onPress={() => {
            navigation.navigate('HouseholdChores', {household});
        }} 
        style={styles.button}
        >
        Navigate to Household
        </Button>
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
        fontSize: 24,
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
        marginBottom: 30,
    },
    buttonLabel: {
        fontSize: 18,
    },
    buttonContent: {
        padding: 8,
    },
});
  
