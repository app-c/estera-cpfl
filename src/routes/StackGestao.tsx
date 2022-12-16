import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { InfoIcon } from "native-base";
import React from "react";
import { Home } from "../pages/Home";

const { Navigator, Screen } = createNativeStackNavigator();

export function StackGestao() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen component={Home} name="home" />
      <Screen component={InfoIcon} name="infoNota" />
    </Navigator>
  );
}
