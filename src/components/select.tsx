import React from "react";
import { Box, Center, Text } from "native-base";
import { Dimensions, Touchable, TouchableOpacity } from "react-native";

interface Props {
  select: boolean;
  presSelect: () => void;
}

export function Slect({ select, presSelect }: Props) {
  const w = Dimensions.get("screen").width / 2;

  return (
    <TouchableOpacity onPress={presSelect}>
      <Center
        borderColor="orange.10"
        borderWidth={3}
        w={w * 0.14}
        h={w * 0.14}
        borderRadius={w * 0.08}
      >
        <Box
          bg={select === true ? "orange.10" : "white.50"}
          w={w * 0.055}
          h={w * 0.055}
          borderRadius={w * 0.08}
        />
      </Center>
    </TouchableOpacity>
  );
}
