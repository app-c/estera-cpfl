import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Home } from "../pages/Home";
import { Grafico } from "../pages/Grafico";
import { GestaoRoutes } from "./GestaoRoutes";
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
