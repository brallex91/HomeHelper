import { NavigationContainer } from "@react-navigation/native";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { AppDarkTheme, AppLightTheme } from "./theme";

type ColorScheme = "light" | "dark" | "auto";

type ThemeContextValue = (colorScheme: ColorScheme) => void;

const ThemeContext = createContext<ThemeContextValue>(() => {});

export default function ThemeProvider({ children }: PropsWithChildren) {
  // Temat som användaren har valt i appen
  const [colorScheme, setColorScheme] = useState<ColorScheme>("auto");

  // Temat som OS'et föreslår
  const operatingSystemScheme = useColorScheme();

  // Temat som faktiskt ska användas
  const selectedScheme =
    colorScheme === "auto" ? operatingSystemScheme : colorScheme;

  // Välj rätt temaobjekt utifrån valt tema
  const theme = selectedScheme === "dark" ? AppDarkTheme : AppLightTheme;

  return (
    <ThemeContext.Provider value={setColorScheme}>
      <PaperProvider theme={theme}>
        <NavigationContainer theme={theme}>{children}</NavigationContainer>
      </PaperProvider>
    </ThemeContext.Provider>
  );
}

// Custom Hook to Consume the setColorTheme function
export const useSetColorTheme = () => useContext(ThemeContext);

// usage:
// const setColorTheme = useSetColorTheme();
// setColorTheme("dark");
