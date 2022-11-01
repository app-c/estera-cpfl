import React from "react";
import { Box, Button, Center, HStack, ScrollView, Text } from "native-base";
import { IPropsEquipe } from "../dtos";

interface Props {
  equipe: IPropsEquipe[];
  closedModal: () => void;
}

export function InfoEquipe({ equipe, closedModal }: Props) {
  return (
    <Box mt="20" p="2" borderRadius={10} bg="blue.100">
      <Button mb="10" onPress={closedModal}>
        FECHAR
      </Button>
      <ScrollView>
        {equipe.map((h) => (
          <Box p="2" borderColor="dark.10" borderWidth={1} mb="5">
            <HStack space="1" mb="1">
              <Center p="2">
                <Text fontSize={20}>{h.equipe}</Text>
              </Center>

              <Box p="2" w="80%">
                {h.dados.map((p) => (
                  <Box mb="1">
                    <Text bold>{p.nome}</Text>
                    <Text>{p.cargo}</Text>
                  </Box>
                ))}
              </Box>
            </HStack>
            <Text fontSize={16} bold>
              Mobilidade: {h.mobilidade === true ? "sim" : "não"}
            </Text>
          </Box>
        ))}
      </ScrollView>
    </Box>
  );
}
