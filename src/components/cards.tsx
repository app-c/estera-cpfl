/* eslint-disable react/require-default-props */
import React from "react";
import { Box, Center, HStack, Text, VStack } from "native-base";
import { Dimensions, TouchableOpacity } from "react-native";
import { Feather, FontAwesome5 } from "expo-vector-icons";
import { IPropsEquipe } from "../dtos";
import { theme } from "../global/theme";

interface Props {
  value: string;
  title: string;
  color: string;
  equipe: IPropsEquipe[];
  supervisor?: string;
  situation: {
    ntParcial: boolean;
    ntCancelada: boolean;
  };
  showModal: () => void;
}

export function Cards({
  value,
  situation,
  title,
  color,
  equipe,
  supervisor,
  showModal,
}: Props) {
  const w = Dimensions.get("window").width;

  return (
    <TouchableOpacity onPress={showModal}>
      <Box
        ml="5"
        mt="5"
        borderColor={color}
        borderWidth="4"
        bg="dark.50"
        w={w * 0.6}
        // h={w * 0.25}
        p="2"
        borderRadius={10}
      >
        <Center bg="white.100">
          <Text bold fontSize={18}>
            {title}
          </Text>
        </Center>

        <VStack mt="2" space="1">
          {equipe && (
            <Box>
              <Text color="white.100" bold>
                Equipe:
              </Text>
              <HStack space={2}>
                {equipe.map((h) => (
                  <Text color="white.50" key={h.id}>
                    {h.equipe}
                  </Text>
                ))}
              </HStack>
            </Box>
          )}
          <Text color="dark.900" bold>
            Supervisor: {supervisor}
          </Text>
          <HStack justifyContent="space-between">
            <Text color="dark.900" bold>
              {value}
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
