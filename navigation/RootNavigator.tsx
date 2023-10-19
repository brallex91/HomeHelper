import { Entypo } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

import PagerView from 'react-native-pager-view';
import AddChoreScreen from '../screens/AddChoreScreen';
import AddNewHousehold from '../screens/AddHouseholdScreen';
import HouseholdScreen from '../screens/HouseholdChoreScreen';
import HouseholdOverviewScreen from '../screens/HouseholdOverviewScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import WelcomeScreen from '../screens/WelcomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Hushållet: undefined;
  HouseholdOverview: undefined;
  AddNewChore: undefined;
  AddNewHousehold: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageNames = ['Idag', 'Förra Veckan'];
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
    <RootStack.Navigator initialRouteName='HouseholdOverview' screenOptions={{ headerTitleAlign: 'center' }}>
      <RootStack.Screen name='Welcome' component={WelcomeScreen} />
      <RootStack.Screen name='Login' component={LoginScreen} />
      <RootStack.Screen name='Register' component={RegisterScreen} />
      <RootStack.Screen
        options={{
          title: 'Välkommen!',
        }}
        name='HouseholdOverview'
        component={HouseholdOverviewScreen}
      />
      <RootStack.Screen name='AddNewChore' component={AddChoreScreen} />
      <RootStack.Screen name='AddNewHousehold' component={AddNewHousehold} />

      {/*Start of HouseHold-Screen*/}
      <RootStack.Screen
        name='Hushållet'
        options={{
          header: () => (
            <SafeAreaView
              style={{
                ...styles.header,
                backgroundColor: theme.colors.background,
              }}
            >
              <Text style={styles.screenName}>Hushållet</Text>
              <View style={styles.navBar}>
                <TouchableOpacity
                  onPress={() => handlePageChange(currentPage - 1)}
                >
                  <Text style={styles.navText}>
                    <Entypo name='chevron-thin-left' size={24} />
                  </Text>
                </TouchableOpacity>
                <Text style={{ ...styles.navText }}>
                  {pageNames[currentPage]}
                </Text>
                <TouchableOpacity
                  onPress={() => handlePageChange(currentPage + 1)}
                >
                  <Text style={styles.navText}>
                    <Entypo name='chevron-thin-right' size={24} />
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          ),
        }}
      >
        {(props) => (
          <HouseholdScreen
            pagerRef={pagerRef}
            handlePageSelected={handlePageSelected}
            currentPage={currentPage}
            pageNames={pageNames}
          />
        )}
      </RootStack.Screen>
      {/*End of HouseHold-Screen*/}
    </RootStack.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
  },
  screenName: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 24,
    fontWeight: 'bold',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  navText: {
    fontSize: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 25,
  },
});
