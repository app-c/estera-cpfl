import React from "react";
import { Box, Center, Text } from "native-base";
import { Dimensions } from "react-native";

interface Props {
  value: string;
  title: string;
  color: string;
}

export function CardTotal({ value, title, color }: Props) {
  const w = Dimensions.get("window").width;
  return (
    <Center
      ml="5"
      mt="5"
      bg={color}
      w={w * 0.6}
      h={w * 0.2}
      p="2"
      borderRadius={10}
    >
      <Text bold color="white.50" fontSize="16">
        {title}
      </Text>
      <Text color="white.50" mt="2">
        {value}
      </Text>
    </Center>
  );
}
