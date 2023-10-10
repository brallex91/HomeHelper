import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1">
        <Text>First page</Text>
      </View>
      <View key="2">
        <Text>Second page</Text>
      </View>
      <View key="3">
        <Text>Third page</Text>
      </View>
      <View key="4">
        <Text>Fourth page</Text>
      </View>
      <View key="5">
        <Text>Fifth page</Text>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
