import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddChoreScreen from "../screens/AddChoreScreen";
import AddNewHousehold from "../screens/AddHouseholdScreen";
import HouseholdChoreScreen from "../screens/HouseholdChoreScreen";
import HouseholdOverviewScreen from "../screens/HouseholdOverviewScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import HouseholdElementOverviewScreen from "../screens/HouseholdElementOverviewScreen";
import ChoreDetailsScreen from "../screens/ChoreDetailsScreen";


export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  HouseholdChores: undefined;
  HouseholdOverview: undefined;
  AddNewChore: undefined;
  AddNewHousehold: undefined;
  HouseholdElementOverviewScreen: { household: Household };
  ChoreDetails: undefined;

};

const RootStack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <RootStack.Navigator initialRouteName="HouseholdOverview">
      <RootStack.Screen
        name="HouseholdChores"
        component={HouseholdChoreScreen}
        options={{
          headerShown: false,
        }}
      />
      <RootStack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="HouseholdOverview"
        component={HouseholdOverviewScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
        <RootStack.Screen
        name="HouseholdElementOverviewScreen"
        component={HouseholdElementOverviewScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="Register"
        component={RegisterScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="AddNewChore"
        component={AddChoreScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
      <RootStack.Screen
        name="AddNewHousehold"
        component={AddNewHousehold}
        options={{
          headerTitleAlign: "center",
        }}
      />
       <RootStack.Screen
        name="ChoreDetails"
        component={ChoreDetailsScreen}
        options={{
          headerTitleAlign: "center",
        }}
      />
    </RootStack.Navigator>
  );
}
