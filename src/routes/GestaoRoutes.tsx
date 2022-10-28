import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "expo-vector-icons";
import { Home } from "../pages/Home";
import { Gestao } from "../pages/Gestao";
import { Stack } from "./Stack";
import { C4 } from "../pages/Gestor/C4";
import { Emergencia } from "../pages/Gestor/Emergencia";

const { Navigator, Screen } = createBottomTabNavigator();

export function GestaoRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
        component={Home}
        name="home"
      />
      <Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="calculator" size={size} color={color} />
          ),
        }}
        component={Stack}
        name="FATURAMENTO"
      />
      <Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="circular-graph" size={size} color={color} />
          ),
        }}
        component={C4}
        name="C4"
      />
      <Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="flash" size={size} color={color} />
          ),
        }}
        component={Emergencia}
        name="EMERGENCIA"
      />
    </Navigator>
  );
}
