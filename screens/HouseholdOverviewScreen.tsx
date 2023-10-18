import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { getHouseholds } from '../api/household';
import { auth } from '../database/firebaseConfig';

export default function HouseholdOverviewScreen() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const userNow = auth.currentUser;

  useEffect(() => {
    async function fetchHouseholds() {
      const householdData = await getHouseholds();
      setHouseholds(householdData);
    }

    fetchHouseholds();
  }, []);

  return (
    <View>
      <Text>Hushåll översikt</Text>
      <FlatList
        data={households}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
}
