import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getCompletedChoresByHousehold } from "../../api/completedChores";
import StatisticComponent from "./StatisticComponent";

interface DataItem {
  number: number;
  emoji: string;
  color: string;
}

const emojis: string[] = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"];

const getColorForEmoji = (emoji: string) => {
  switch (emoji) {
    case "🦊":
      return "#ff7e46";
    case "🐷":
      return "#ffab91";
    case "🐸":
      return "#e4fb7d";
    case "🐥":
      return "#fcd932";
    case "🐙":
      return "#cd5d6f";
    case "🐬":
      return "#5dc5d6";
    case "🦉":
      return "#e1ae93";
    case "🦄":
      return "#ce84ce";
    default:
      return "#FFFFFF";
  }
};

const generateRandomData = (maxCount: number, maxTotal: number): DataItem[] => {
  const data: DataItem[] = [];
  let total = 0;
  const remainingEmojis = [...emojis];

  while (data.length < maxCount) {
    const minNumber = 15;
    const maxNumber = Math.min(maxTotal - total + 1, 100 - total + 1);

    if (maxNumber < minNumber) {
      break;
    }

    const number =
      Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;

    if (remainingEmojis.length === 0) {
      break;
    }
    const emojiIndex = Math.floor(Math.random() * remainingEmojis.length);
    const emoji = remainingEmojis.splice(emojiIndex, 1)[0];
    const color = getColorForEmoji(emoji);

    data.push({ number, emoji, color });
    total += number;
  }

  return data;
};

const mockChoreData: string[] = [
  "Chore1",
  "Chore2",
  "Chore3",
  "Chore4",
  "Chore5",
  "Chore6",
];

async function getChoreStatistics(
  householdId: string
): Promise<Array<{ profileId: string; choreId: string; completed: number }>> {
  const completedChores = await getCompletedChoresByHousehold(householdId);
  const statisticsArray: Array<{
    profileId: string;
    choreId: string;
    completed: number;
  }> = [];

  completedChores.forEach((chore) => {
    const { profileId, choreId } = chore;

    // Hitta om en statistikpost redan finns för den här profilen och sysslan
    const existingStat = statisticsArray.find(
      (stat) => stat.profileId === profileId && stat.choreId === choreId
    );

    if (existingStat) {
      // Om en statistikpost finns, öka den slutförda räkningen
      existingStat.completed++;
    } else {
      // Om ingen statistikpost finns, skapa en ny med en slutförd räkning av 1
      statisticsArray.push({ profileId, choreId, completed: 1 });
    }
  });

  console.log(statisticsArray);
  return statisticsArray;
}

const StatisticView: React.FC<{ householdId: string }> = ({ householdId }) => {
  const [choreStatistics, setChoreStatistics] = React.useState<
    Array<{ profileId: string; choreId: string; completed: number }>
  >([]);

  React.useEffect(() => {
    async function fetchChoreStatistics() {
      const statistics = await getChoreStatistics("nNVCHbnOztwqObuJ8Iuo");
      setChoreStatistics(statistics);
    }

    fetchChoreStatistics();
  }, [householdId]);

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          marginTop: 30,
        }}
      >
        <View style={styles.chartContainer}>
          <StatisticComponent
            data={generateRandomData(8, 100)}
            chartSize={250}
            emojiSize={25}
          />
          <Text style={styles.chartTitle}>Totalt</Text>
        </View>
      </View>

      <View style={[styles.flexContainer, { marginTop: 20 }]}>
        {mockChoreData.map((category, index) => (
          <View key={index} style={styles.flexItem}>
            <View style={styles.chartContainer}>
              <StatisticComponent
                data={generateRandomData(4, 100)}
                chartSize={100}
                emojiSize={15}
              />
              <Text style={styles.chartTitle}>{category}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flexContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    margin: 10,
  },
  flexItem: {
    width: "30%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  chartContainer: {
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default StatisticView;
