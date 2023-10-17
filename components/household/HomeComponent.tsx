import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Text } from "react-native-paper";
import { getUsers } from "../../api/user";

export default function HomeComponent() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const usersData = await getUsers();
      setUsers(usersData);
    }

    fetchUsers();
  }, []);

  return (
    <View>
      <Text>Home Component</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>
            {item.name} {item.email}
          </Text>
        )}
      />
    </View>
  );
}
