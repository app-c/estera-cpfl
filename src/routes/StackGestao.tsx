import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Executada } from "../pages/Executada";
import { Home } from "../pages/Home";
import { InfoNota } from "../pages/Infonota";
import { Tratativa } from "../pages/Tratativa";

const { Navigator, Screen } = createNativeStackNavigator();

export function StackGestao() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen component={Home} name="home" />
      <Screen component={InfoNota} name="infoNota" />
      <Screen component={Tratativa} name="tratativa" />
      <Screen component={Executada} name="executada" />
    </Navigator>
  );
}
