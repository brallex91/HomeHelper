import { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
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

  const choreCard = ({ item }: { item: Chore }) => (
    <Card style={styles.card}>
      <Card.Title
        title={item.name}
        right={(props) => <Text style={styles.userIcons}>🐷</Text>}
      />
    </Card>
  );

  return (
    <View style={styles.cardContainer}>
      <FlatList
        data={chores}
        keyExtractor={(item) => item.id}
        renderItem={choreCard}
      />
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
});
