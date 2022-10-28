import React from "react";
import { Box, HStack, Text } from "native-base";

interface Props {
  situation: string;
  color: string;
  total: string;
}

export function Resumo({ situation, color, total }: Props) {
  return (
    <Box p="1">
      <HStack alignItems="center" space={5}>
        <Box w="10" h="15" bg={color} />
        <Text color="dark.900" bold fontSize={20}>
          {situation}
        </Text>

        <Text color="dark.900" bold fontSize={20}>
          {total}
        </Text>
      </HStack>
    </Box>
  );
}
