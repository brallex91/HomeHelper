import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "./navigation/RootNavigator";
import ThemeProvider from "./themes/ThemeContext";
import { store } from "./store/store";
import { Provider as ReduxProvider } from "react-redux";

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </ReduxProvider>
  );
}
