/* eslint-disable react/require-default-props */
import { Feather } from "expo-vector-icons";
import { Box, Center, HStack, Text, VStack } from "native-base";
import React from "react";
import { Dimensions, TouchableOpacity } from "react-native";
import { IProsEster } from "../dtos";
import { theme } from "../global/theme";

interface Props {
  nota: IProsEster;
  color: string;
  situation: {
    ntParcial: boolean;
    ntCancelada: boolean;
  };
  showModal: () => void;
}

export function Cards({ nota, situation, color, showModal }: Props) {
  const w = Dimensions.get("window").width;

  const mo = nota.MO.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <TouchableOpacity onPress={showModal}>
      <Box
        ml="5"
        mt="5"
        borderColor={color}
        borderWidth="4"
        bg="dark.50"
        w={w * 0.6}
        p="2"
        borderRadius={10}
      >
        <Center bg="white.100">
          <Text bold fontSize={16}>
            {nota.Nota}
          </Text>
        </Center>

        <VStack mt="2" space="1">
          {nota.EQUIPE && (
            <Box>
              <Text color="white.100" bold>
                Equipe:
              </Text>
              <HStack space={2}>
                {nota.EQUIPE.map((h) => (
                  <Text color="white.50" key={h.id}>
                    {h.equipe}
                  </Text>
                ))}
              </HStack>
            </Box>
          )}

          <Text color="white.100">TES/TLE: {nota.TLE}</Text>
          <Text color="dark.900" bold>
            Supervisor: {nota.SUPERVISOR}
          </Text>
          <HStack justifyContent="space-between">
            <Text color="dark.900" bold>
              {mo}
            </Text>

            {situation.ntParcial && (
              <TouchableOpacity>
                <Box>
                  <Feather
                    name="alert-circle"
                    size={26}
                    color={theme.colors.orange[10]}
                  />
                </Box>
              </TouchableOpacity>
            )}

            {situation.ntCancelada && (
              <TouchableOpacity>
                <Box>
                  <Feather
                    name="x-square"
                    size={26}
                    color={theme.colors.red[10]}
                  />
                </Box>
              </TouchableOpacity>
            )}
          </HStack>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
}
