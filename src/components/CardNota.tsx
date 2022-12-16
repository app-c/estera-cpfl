import { Box, Center, HStack, Image, Text } from "native-base";
import React from "react";
import { TouchableOpacity } from "react-native";
import truck from "../assets/images.png";

interface Props {
  nota: number;
  nome: string;
  presObs: () => void;
  presTruck: () => void;
  valor: string;
  data: string;
}

export function Card({ nota, nome, presObs, presTruck, valor, data }: Props) {
  return (
    <Box
      mt="1.5"
      borderRadius={10}
      bg="white.50"
      borderWidth={2}
      borderColor="dark.600"
    >
      <Center p="2" bg="white.100">
        <Text color="dark.50" bold fontSize="20">
          {nota}
        </Text>
      </Center>

      <Box p="5" mt="5">
        <HStack justifyContent="space-around">
          <TouchableOpacity onPress={presTruck}>
            <Center>
              <Image alt="image" size="20" source={truck} />
              <Text fontSize={16} mt="2" bold>
                EQUIPES
              </Text>
            </Center>
          </TouchableOpacity>

          <Box>
            <Text>supervisor</Text>
            <Text bold fontSize={16}>
              {nome}
            </Text>
            <Text>{data}</Text>

            <Text top="3">{valor}</Text>

            <TouchableOpacity onPress={presObs}>
              <Center borderRadius={5} mt="10" bg="blue.10">
                <Text bold>obs</Text>
              </Center>
            </TouchableOpacity>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}
