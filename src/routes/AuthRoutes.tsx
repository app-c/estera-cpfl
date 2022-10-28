import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "expo-vector-icons";
import { Home } from "../pages/Home";
import { Grafico } from "../pages/Grafico";
import { GestaoRoutes } from "./GestaoRoutes";

const { Navigator, Screen } = createBottomTabNavigator();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        component={Home}
        name="HOME"
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="home" size={size} color={color} />
          ),
        }}
      />
      <Screen
        options={{
          tabBarIcon: ({ size, color }) => (
            <Entypo name="area-graph" size={size} color={color} />
          ),
        }}
        component={Grafico}
        name="grafico"
      />
    </Navigator>
  );
}
