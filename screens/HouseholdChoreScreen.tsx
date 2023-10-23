import { Entypo } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Text, useTheme } from "react-native-paper";
import HouseholdListComponent from "../components/household/HouseholdListComponent";
import StatisticView from "../components/household/StatisticView";

export default function HouseholdChoreScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageNames = ["Idag", "Förra Veckan"];
  const pagerRef = useRef<PagerView | null>(null);
  const theme = useTheme();

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pageNames.length) {
      setCurrentPage(newPage);
      pagerRef.current?.setPage(newPage);
    }
  };

  const handlePageSelected = (event: { nativeEvent: { position: number } }) => {
    setCurrentPage(event.nativeEvent.position);
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          backgroundColor: theme.colors.background,
          marginTop: 24,
        }}
      >
        <Text style={styles.screenName}>Hushållet</Text>
        <View style={styles.navBar}>
          <TouchableOpacity onPress={() => handlePageChange(currentPage - 1)}>
            <Text style={styles.navText}>
              <Entypo name="chevron-thin-left" size={24} />
            </Text>
          </TouchableOpacity>
          <Text style={{ ...styles.navText }}>{pageNames[currentPage]}</Text>
          <TouchableOpacity onPress={() => handlePageChange(currentPage + 1)}>
            <Text style={styles.navText}>
              <Entypo name="chevron-thin-right" size={24} />
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <PagerView
        style={styles.pagerView}
        initialPage={currentPage}
        ref={pagerRef}
        onPageSelected={handlePageSelected}
      >
        <View key="1">
          <HouseholdListComponent />
        </View>
        <View key="2">
          <StatisticView />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  screenName: {
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
  },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 15,
  },
  pagerView: {
    flex: 1,
  },
});
