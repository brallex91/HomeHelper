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

const mapStatisticsToDataItems = (
  statistics: Array<{ profileId: string; choreId: string; completed: number }>
): DataItem[] => {
  return statistics.map((stat, index) => {
    const emoji = emojis[index % emojis.length];  // Cycle through emojis
    const color = getColorForEmoji(emoji);
    return { number: stat.completed, emoji, color };
  });
};


async function getChoreStatistics(
  householdId: string
): Promise<Array<{ profileId: string; choreId: string; completed: number }>> {
  const completedChores = await getCompletedChoresByHousehold(householdId);
  const statisticsMap: Map<string, { profileId: string; choreId: string; completed: number }> = new Map();

  completedChores.forEach((chore) => {
    // Trim any extra whitespace from the profileId and choreId
    const profileId = chore.profileId.trim();
    const choreId = chore.choreId.trim();
    const key = `${profileId}-${choreId}`;  // Create a unique key for each profile-chore pair

    const existingStat = statisticsMap.get(key);

    if (existingStat) {
      // If a statistics entry exists, increment the completed count
      existingStat.completed++;
    } else {
      // If no statistics entry exists, create a new one with a completed count of 1
      statisticsMap.set(key, { profileId, choreId, completed: 1 });
    }
  });

  // Convert the Map to an Array before returning
  const statisticsArray = Array.from(statisticsMap.values());
  
  console.log(statisticsArray);
  return statisticsArray;
}


const StatisticView: React.FC<{ householdId: string }> = ({ householdId }) => {
  const [choreStatistics, setChoreStatistics] = React.useState<
    Array<{ profileId: string; choreId: string; completed: number }>
  >([]);

  React.useEffect(() => {
    async function fetchChoreStatistics() {
      const statistics = await getChoreStatistics("Hus 1");
      setChoreStatistics(statistics);
    }

    fetchChoreStatistics();
  }, [householdId]);

  const dataItems = React.useMemo(() => mapStatisticsToDataItems(choreStatistics), [choreStatistics]);

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
            data={dataItems}
            chartSize={250}
            emojiSize={25}
          />
          <Text style={styles.chartTitle}>Totalt</Text>
        </View>
      </View>

      <View style={[styles.flexContainer, { marginTop: 20 }]}>
        {dataItems.map((category, index) => (
          <View key={index} style={styles.flexItem}>
            <View style={styles.chartContainer}>
              <StatisticComponent
                data={dataItems}
                chartSize={100}
                emojiSize={15}
              />
              {/* <Text style={styles.chartTitle}>{category}</Text> */}
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
