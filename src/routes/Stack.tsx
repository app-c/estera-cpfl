import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Gestao } from "../pages/Gestao";
import { Executada } from "../pages/Gestor/Executa";
import { Parcial } from "../pages/Gestor/Parcial";

const { Navigator, Screen } = createNativeStackNavigator();

export function Stack() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen component={Gestao} name="gestao" />
      <Screen component={Executada} name="executada" />
      <Screen component={Parcial} name="parcial" />
    </Navigator>
  );
}
