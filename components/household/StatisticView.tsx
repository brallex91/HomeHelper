import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import StatisticComponent from "./StatisticComponent";

const emojis: string[] = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"];

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
      return "#fff1f1";
    default:
      return "#FFFFFF";
  }
};

const generateRandomData = (maxCount: number, maxTotal: number): DataItem[] => {
  const data: DataItem[] = [];
  let total = 0;
  const remainingEmojis = [...emojis];

  while (data.length < maxCount) {
    const minNumber = 20;
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

const StatisticView: React.FC = () => {
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
    backgroundColor: "#EFEFEF",
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
