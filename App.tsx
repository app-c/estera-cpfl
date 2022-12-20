import { NavigationContainer } from "@react-navigation/native";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import { Box, NativeBaseProvider } from "native-base";
import React from "react";
import { NotasProvider } from "./src/context/ListNotas";
import { theme } from "./src/global/theme";
import AppProvider from "./src/hooks";
import { Route } from "./src/routes";

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
