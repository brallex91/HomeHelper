import React from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import HomeComponent from "../components/household/HomeComponent";
import StatisticComponent from "../components/household/StatisticComponent";

interface HomeScreenProps {
  pagerRef: React.RefObject<any>;
  handlePageSelected: (event: { nativeEvent: { position: number } }) => void;
  currentPage: number;
  pageNames: string[];
}

export default function HouseholdScreen(props: HomeScreenProps) {
  return (
    <View style={{ flex: 1 }}>
      <PagerView
        style={styles.pagerView}
        initialPage={props.currentPage}
        ref={props.pagerRef}
        onPageSelected={props.handlePageSelected}
      >
        <View key="1">
          <HomeComponent />
        </View>
        <View key="2">
          <StatisticComponent />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
