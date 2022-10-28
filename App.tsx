import "intl";
import "intl/locale-data/jsonp/pt-BR";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { Box, NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import AppProvider from "./src/hooks";
import { Route } from "./src/routes";
import { NotasProvider } from "./src/context/ListNotas";
import { theme } from "./src/global/theme";

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <AppProvider>
        <Box flex="1">
          <NavigationContainer>
            <NotasProvider>
              <Route />
            </NotasProvider>
          </NavigationContainer>
        </Box>
      </AppProvider>
    </NativeBaseProvider>
  );
}
