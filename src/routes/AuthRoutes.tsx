import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo } from "expo-vector-icons";
import React from "react";
import { Grafico } from "../pages/Grafico";
import { StackGestao } from "./StackGestao";

const { Navigator, Screen } = createBottomTabNavigator();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen
        component={StackGestao}
        name="Gestão"
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
