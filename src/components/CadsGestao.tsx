import { Box, Center, HStack, Text } from "native-base";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";

interface Props {
  title: string;
  valor: string;
  color: string;
  pres: () => void;
}

export function CardGestao({ title, valor, color, pres }: Props) {
  const w = Dimensions.get("window").width;

  return (
    <TouchableOpacity onPress={pres}>
      <Center
        borderRadius={10}
        mb="5"
        p="5"
        borderColor={color}
        borderWidth="3"
        bg="white.50"
        w="100%"
      >
        <Text fontSize={18} bold>
          {title}
        </Text>

        <Text mt="5">{valor}</Text>
      </Center>
    </TouchableOpacity>
  );
}
