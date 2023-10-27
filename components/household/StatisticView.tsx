import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getCompletedChoresByHousehold } from "../../api/completedChores";
import StatisticComponent from "./StatisticComponent";
import { emojiMap, EmojiKeys } from '../../screens/HouseholdElementOverviewScreen';
import { getProfiles } from "../../api/profiles";

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
  statistics: Array<{ profileId: string; choreId: string; completed: number; avatar: EmojiKeys }>
): DataItem[] => {
  return statistics.map((stat) => {
    const emoji = emojiMap[stat.avatar] || '❓';
    const color = getColorForEmoji(emoji);
    return { number: stat.completed, emoji, color };
  });
};

const getChoreStatistics = async (
  householdId: string
): Promise<Array<{ profileId: string; choreId: string; completed: number; avatar: EmojiKeys }>> => {
  const completedChores = await getCompletedChoresByHousehold(householdId);
  const profiles = await getProfiles();
  const profileAvatarMap = Object.fromEntries(profiles.map(profile => [profile.id, profile.avatar]));
  const profileNameIdMap = Object.fromEntries(profiles.map(profile => [profile.name, profile.id]));  // Assumes profiles have a 'name' field
  console.log('Profile Avatar Map:', profileAvatarMap);

  const statisticsMap: Map<string, { profileId: string; choreId: string; completed: number; avatar: EmojiKeys }> = new Map();

  completedChores.forEach((chore) => {
    const profileId = profileNameIdMap[chore.profileId.trim()];  // Map profile names to identifier strings
    const choreId = chore.choreId.trim();
    const key = `${profileId}-${choreId}`;
    const avatar = profileAvatarMap[profileId] as EmojiKeys;

    console.log('Avatar for profileId', profileId, ':', avatar);
    const existingStat = statisticsMap.get(key);

    if (existingStat) {
      existingStat.completed++;
    } else {
      statisticsMap.set(key, { profileId, choreId, completed: 1, avatar });
    }
  });

  return Array.from(statisticsMap.values());
};


const StatisticView: React.FC<{ householdId: string }> = ({ householdId }) => {
  const [choreStatistics, setChoreStatistics] = React.useState<
    Array<{ profileId: string; choreId: string; completed: number; avatar: EmojiKeys }>
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
