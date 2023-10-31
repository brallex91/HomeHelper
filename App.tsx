import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as ReduxProvider } from "react-redux";
import { GlobalProvider } from "./context/context";
import RootNavigator from "./navigation/RootNavigator";
import { store } from "./store/store";
import ThemeProvider from "./themes/ThemeContext";

export default function App() {
  return (  
    <GlobalProvider>
    <ReduxProvider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </SafeAreaProvider>
    </ReduxProvider>
    </GlobalProvider>
  );
}
