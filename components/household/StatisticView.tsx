import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { getChores } from "../../api/chores";
import { getCompletedChoresByHousehold } from "../../api/completedChores";
import { getProfiles } from "../../api/profiles";
import {
  EmojiKeys,
  emojiMap,
} from "../../screens/HouseholdElementOverviewScreen";
import OptionsButton from "../OptionsButton";
import StatisticComponent from "./StatisticComponent";

interface DataItem {
  number: number;
  emoji: string;
  color: string;
}

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
  statistics: Array<{ profileId: string; completed: number; avatar: EmojiKeys }>
): DataItem[] => {
  return statistics.map((stat) => {
    const emoji = emojiMap[stat.avatar] || "❓";
    const color = getColorForEmoji(emoji);
    return { number: stat.completed, emoji, color };
  });
};

const getChoreStatistics = async (
  householdId: string
): Promise<
  Array<{ profileId: string; completed: number; avatar: EmojiKeys }>
> => {
  const completedChores = await getCompletedChoresByHousehold(householdId);
  const profiles = await getProfiles();
  const profileAvatarMap = Object.fromEntries(
    profiles.map((profile) => [profile.id, profile.avatar])
  );
  const chores = await getChores();

  const statisticsMap: Map<
    string,
    { profileId: string; completed: number; avatar: EmojiKeys }
  > = new Map();
  const choreIdMap = Object.fromEntries(
    chores.map((chore) => [chore.id, chore])
  );

  completedChores.forEach((chore) => {
    const profileId = chore.profileId.trim();
    const avatar = profileAvatarMap[profileId] as EmojiKeys;
    const energy = choreIdMap[chore.choreId]?.energyLevel || 0;
    const existingStat = statisticsMap.get(profileId);

    if (existingStat) {
      existingStat.completed++;
    } else {
      statisticsMap.set(profileId, { profileId, completed: 1 + energy, avatar });
    }
  });
  console.log(statisticsMap);
  return Array.from(statisticsMap.values());
};

interface ChoreStatistics {
  [choreName: string]: {
    [profileName: string]: {
      count: number;
      avatar: EmojiKeys;
    };
  };
}

const mapChoreStatisticsToDataItems = (
  statistics: ChoreStatistics
): Record<string, DataItem[]> => {
  const result: Record<string, DataItem[]> = {};

  for (const choreName in statistics) {
    result[choreName] = Object.values(statistics[choreName]).map(
      ({ count, avatar }) => ({
        number: count,
        emoji: emojiMap[avatar] || "❓",
        color: getColorForEmoji(emojiMap[avatar] || "❓"),
      })
    );
  }

  return result;
};

const getHouseholdChoreStatistics = async (householdId: string) => {
  const completedChores = await getCompletedChoresByHousehold(householdId);
  const profiles = await getProfiles();
  const chores = await getChores();

  const profileIdMap = Object.fromEntries(
    profiles.map((profile) => [profile.id, profile])
  );
  const choreIdMap = Object.fromEntries(
    chores.map((chore) => [chore.id, chore])
  );

  const statistics: ChoreStatistics = {};

  completedChores.forEach((chore) => {
    const choreName = choreIdMap[chore.choreId]?.name || "Unknown Chore";
    const profileId = chore.profileId;
    const profile = profileIdMap[profileId];
    const profileName = profile?.name || "Unknown Profile";
    const avatar = (profile?.avatar || "❓") as EmojiKeys;
    const energy = choreIdMap[chore.choreId]?.energyLevel || 0;

    if (!statistics[choreName]) {
      statistics[choreName] = {};
    }

    if (!statistics[choreName][profileName]) {
      statistics[choreName][profileName] = { count: 0 + energy, avatar };
    }

    statistics[choreName][profileName].count++;
  });

  return statistics;
};

const StatisticView: React.FC<{ householdId: string }> = ({ householdId }) => {
  const [choreStatistics, setChoreStatistics] = React.useState<
    Array<{ profileId: string; completed: number; avatar: EmojiKeys }>
  >([]);
  const [householdChoreStatistics, setHouseholdChoreStatistics] =
    React.useState<ChoreStatistics>({});

  React.useEffect(() => {
    async function fetchStatistics() {
      const choreStats = await getChoreStatistics(householdId);
      const householdChoreStats =
        await getHouseholdChoreStatistics(householdId);
      setChoreStatistics(choreStats);
      setHouseholdChoreStatistics(householdChoreStats);
    }

    fetchStatistics();
  }, [householdId]);

  const dataItems = React.useMemo(
    () => mapStatisticsToDataItems(choreStatistics),
    [choreStatistics]
  );
  const choreDataItems = React.useMemo(
    () => mapChoreStatisticsToDataItems(householdChoreStatistics),
    [householdChoreStatistics]
  );

  useFocusEffect(
    React.useCallback(() => {
      async function fetchStatistics() {
        const choreStats = await getChoreStatistics(householdId);
        const householdChoreStats =
          await getHouseholdChoreStatistics(householdId);
        setChoreStatistics(choreStats);
        setHouseholdChoreStatistics(householdChoreStats);
      }

      fetchStatistics();
    }, [householdId])
  );

  return (
    <View style={styles.container}>
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
          {Object.entries(choreDataItems).map(
            ([choreName, dataItems], index) => (
              <View key={index} style={styles.flexItem}>
                <View style={styles.chartContainer}>
                  <StatisticComponent
                    data={dataItems}
                    chartSize={100}
                    emojiSize={15}
                  />
                  <Text style={styles.chartTitle}>{choreName}</Text>
                </View>
              </View>
            )
          )}
        </View>
      </ScrollView>
      <View style={styles.optionsButtonContainer}>
        <OptionsButton size={36} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
  optionsButtonContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default StatisticView;
