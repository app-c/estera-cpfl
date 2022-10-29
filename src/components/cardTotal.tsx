import React from "react";
import { Box, Center, Text } from "native-base";
import { Dimensions } from "react-native";

interface Props {
  value: string;
  title: string;
  color: string;
}

export function CardTotal({ value, title, color }: Props) {
  const w = Dimensions.get("window").width / 2;
  return (
    <Center ml="5" mt="5" bg={color} w={w * 0.7} p="2" borderRadius={10}>
      <Text bold color="white.50" fontSize="14">
        {title}
      </Text>
      <Text color="white.50" mt="2">
        {value}
      </Text>
    </Center>
  );
}
