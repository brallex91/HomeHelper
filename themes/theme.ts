import { DarkTheme, DefaultTheme } from "@react-navigation/native";
import { MD2DarkTheme, MD2LightTheme } from "react-native-paper";

export const AppLightTheme = {
  ...MD2LightTheme,
  ...DefaultTheme,
  colors: {
    ...MD2LightTheme.colors,
    ...DefaultTheme.colors,
    primary: "rgb(255,255,255)",
    background: "rgb(242, 242, 242)",
  },
};

export const AppDarkTheme = {
  ...MD2DarkTheme,
  ...DarkTheme,
  colors: {
    ...MD2DarkTheme.colors,
    ...DarkTheme.colors,
    primary: "rgb(255, 45, 85)",
    background: "rgb(10, 10, 10)",
  },
};
