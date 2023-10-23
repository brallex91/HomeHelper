import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { getProfiles } from '../api/profiles'; 

type RootStackParamList = {
  HouseholdElementOverviewScreen: { household: Household };
};

type HouseholdElementOverviewScreenRouteProp = RouteProp<RootStackParamList, 'HouseholdElementOverviewScreen'>;

const HouseholdElementOverviewScreen = () => {
  const route = useRoute<HouseholdElementOverviewScreenRouteProp>();
  const { household } = route.params;

  const [profiles, setProfiles] = React.useState<Profile[]>([]);

  React.useEffect(() => {
    async function fetchProfiles() {
      const profilesData = await getProfiles();
      setProfiles(profilesData);
    }

    fetchProfiles();
  }, []);

  return (
    <View>
      <Text>{household.name}</Text>
      <Text>Key: {household.key}</Text>
      <FlatList
        data={household.members}
        keyExtractor={(item) => item}
        renderItem={({ item }) => {
          const profile = profiles.find(profile => profile.id === item);
          return (
            <View>
              <Text>{profile?.name}</Text>
              <Text>{profile?.avatar}</Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default HouseholdElementOverviewScreen;
