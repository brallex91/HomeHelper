import React, { Component } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import PieChart from "react-native-pie-chart";

export default class TestChart extends Component {
  render() {
    const largeChartData = [123, 321, 123, 789, 537];
    const sliceColor = ["#fbd203", "#ffb300", "#ff9100", "#ff6c00", "#ff3c00"];

    const smallChartsData = [
      {
        series: [50, 50],
        sliceColor: ["#fbd203", "#ffb300"],
        description: "Chore",
      },
      {
        series: [75, 25],
        sliceColor: ["#ff9100", "#ff6c00"],
        description: "Chore",
      },
      {
        series: [60, 40],
        sliceColor: ["#ff3c00", "#ffb300"],
        description: "Chore",
      },
      {
        series: [50, 50],
        sliceColor: ["#fbd203", "#ffb300"],
        description: "Chore",
      },
      {
        series: [75, 25],
        sliceColor: ["#ff9100", "#ff6c00"],
        description: "Chore",
      },
      {
        series: [60, 40],
        sliceColor: ["#ff3c00", "#ffb300"],
        description: "Chore",
      },
    ];

    const smallChartRows = [];
    for (let i = 0; i < smallChartsData.length; i += 3) {
      smallChartRows.push(smallChartsData.slice(i, i + 3));
    }

    return (
      <View style={styles.container}>
        <View style={styles.largeChartContainer}>
          <View style={styles.chartWithIcon}>
            <PieChart
              widthAndHeight={200}
              series={largeChartData}
              sliceColor={sliceColor}
            />
          </View>
          <Text style={styles.chartText}>Totalt</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.smallChartsContainer}
          showsVerticalScrollIndicator={false}
        >
          {smallChartRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.smallChartRow}>
              {row.map((item, index) => (
                <View
                  key={index}
                  style={{
                    ...styles.smallChart,
                    width: 100,
                    height: 200,
                  }}
                >
                  <View style={styles.chartWithIcon}>
                    <PieChart
                      widthAndHeight={100}
                      series={item.series}
                      sliceColor={item.sliceColor}
                    />
                    <Text style={styles.emoji}>🐷</Text>
                  </View>
                  <Text style={styles.chartText}>{item.description}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 50,
  },
  largeChartContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  smallChartsContainer: {
    alignItems: "center",
  },
  smallChartRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: -60,
  },
  smallChart: {
    margin: 5,
  },
  chartWithIcon: {
    alignItems: "center",
    position: "relative",
  },
  chartText: {
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
  },
  emoji: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
});
