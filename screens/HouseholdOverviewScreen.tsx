import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, useTheme } from "react-native-paper";
import { getHouseholds } from "../api/household";

export default function HouseholdOverviewScreen() {
  const [households, setHouseholds] = useState<Household[]>([]);
  const navigation = useNavigation();
  const navigateToHouseholdElementOverview = (household: Household) => {
    navigation.navigate("HouseholdElementOverviewScreen", { household });
  };

  const theme = useTheme();

  useEffect(() => {
    async function fetchHouseholds() {
      const householdData = await getHouseholds();
      setHouseholds(householdData);
    }

    fetchHouseholds();
  }, []);

  const navigateAddNewHousehold = () => {
    navigation.navigate("AddNewHousehold");
  };

  const BottomButtonBar = () => (
    <View style={styles.buttonBar}>
      <Button
        icon="plus-circle-outline"
        mode="contained"
        buttonColor={theme.colors.primary}
        onPress={navigateAddNewHousehold}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Lägg till nytt hushåll
      </Button>
      <Button
        icon="plus-circle-outline"
        mode="contained"
        buttonColor={theme.colors.primary}
        onPress={navigateAddNewHousehold}
        style={styles.button}
        labelStyle={styles.buttonLabel}
        contentStyle={styles.buttonContent}
      >
        Gå med i ett hushåll
      </Button>
    </View>
  );

  return (
    <View>
      <ScrollView contentContainerStyle={styles.cardContainer}>
        {households.map((household) => (
          <Card 
            key={household.id} 
            style={styles.card}
            onPress={() => navigateToHouseholdElementOverview(household)}  
          >
            <Card.Title title={household.name} />
          </Card>
        ))}
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
    flexDirection: "column",
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
