import React from "react";
import { StyleSheet, View } from "react-native";
import StatisticComponent from "./StatisticComponent";

const emojis = ["🦊", "🐷", "🐸", "🐥", "🐙", "🐬", "🦉", "🦄"];

const mockData = [
  { number: 20, emoji: emojis[4] },
  { number: 15, emoji: emojis[5] },
  { number: 10, emoji: emojis[0] },
];

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

const coloredData = mockData.map((item) => ({
  ...item,
  color: getColorForEmoji(item.emoji),
}));

const StatisticView: React.FC = () => {
  return (
    <View style={styles.container}>
      <StatisticComponent data={coloredData} chartSize={250} emojiSize={25} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StatisticView;
