/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
import { Box, Center, HStack, Text, VStack } from "native-base";
import React from "react";
import { IProsEster } from "../../dtos";
import {
  BoxButton,
  BoxContainer,
  BoxEquipe,
  Container,
  Content,
  ContentButton,
  TextButon
} from "./styles";

interface Props {
  nota: IProsEster;
  color: string;
  info: () => void

  finish?: () => void;
  partial?: () => void
  canceled?: () => void
}

export function Cards({ nota, info, canceled, partial,  color = "#747474", finish }: Props) {
  const mo = nota.MO.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return (
    <BoxContainer onPress={info}>
      <Container color={color}>
        <Center bg="white.100">
          <Text bold fontSize={16}>
            {nota.Nota}
          </Text>
        </Center>

        <Content>
          <VStack space="1">
            {nota.EQUIPE && (
              <Box>
                <Text color="white.100" bold>
                  Equipe:
                </Text>
                <BoxEquipe>
                  {nota.EQUIPE.map((h) => (
                    <Text color="white.50" key={h.id}>
                      {h.equipe}
                    </Text>
                  ))}
                </BoxEquipe>
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
{/* 
              {nota.situation === 'nt_parcial' && (
                <BoxButton>
                  <Box>
                    <Feather
                      name="alert-circle"
                      size={26}
                      color={theme.colors.orange[10]}
                    />
                  </Box>
                </BoxButton>
              )}

              {nota.situation === 'nt_cancelada' && (
                <BoxButton>
                  <Box>
                    <Feather
                      name="x-square"
                      size={26}
                      color={theme.colors.red[10]}
                    />
                  </Box>
                </BoxButton>
              )} */}

            </HStack>
              {nota.situation === 'processo' && (
                <ContentButton>
                  <BoxButton onPress={canceled} color='canceled' >
                    <Box>
                      <TextButon>cancelada</TextButon>
                    </Box>
                  </BoxButton>

                  <BoxButton onPress={partial} color='partial' >
                    <Box>
                      <TextButon>parcial</TextButon>
                    </Box>
                  </BoxButton>


                  <BoxButton onPress={finish} color='finish' >
                    <Box>
                      <TextButon>100%</TextButon>
                    </Box>
                  </BoxButton>
                </ContentButton>
              )}
          </VStack>
        </Content>
      </Container>
    </BoxContainer>
  );
}
