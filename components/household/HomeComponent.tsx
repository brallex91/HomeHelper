import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { getChores } from "../../api/chores";

export default function HomeComponent() {
  const [chores, setChores] = useState<Chore[]>([]);

  useEffect(() => {
    async function fetchChores() {
      try {
        const choresData = await getChores();
        setChores(choresData);
      } catch (error) {
        console.error("Error fetching chores:", error);
      }
    }

    fetchChores();
  }, []);

  return (
    <View>
      <Text>Home Component</Text>
      <FlatList
        data={chores}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} {item.description} {item.energyLevel}
          </Text>
        )}
      />
    </View>
  );
}
