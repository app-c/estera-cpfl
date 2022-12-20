import { useRoute } from "@react-navigation/native";
import { HStack, ScrollView, Text } from "native-base";
import React from "react";
import { Header } from "../components/header";
import { IProsEster } from "../dtos";
import { Container, ContentInfo } from "./styles/infoNota";

interface PropsRoute {
  item: IProsEster;
}

export function InfoNota() {
  const route = useRoute();
  const { item } = route.params as PropsRoute;

  return (
    <>
      <Header />
      <ScrollView>
        <Container>
          <Text color="#fff" fontWeight={600} bold fontSize={16} mt="5">
            Informaçoes da na nota
          </Text>

          <ContentInfo>
            <Text alignSelf="center" bold fontSize={16}>
              {item.Nota}
            </Text>

            <Text>data: {item.Dt_programação}</Text>
            <Text>MO: {item.MO}</Text>
            <Text>cidade: {item.cidade}</Text>
            <Text>Qnt clientes: {item.Qtde_clientes}</Text>
            <Text bold>TES/TLE: {item.TLE}</Text>
          </ContentInfo>

          <Text color="#fff" fontWeight={600} bold fontSize={16} mt="5">
            Equipes
          </Text>

          <ContentInfo>
            <HStack space={4}>
              {item.EQUIPE.map((h) => (
                <Text key={h.equipe}>{h.equipe}</Text>
              ))}
            </HStack>
          </ContentInfo>

          <Text color="#fff" fontWeight={600} bold fontSize={16} mt="5">
            Observações do planejamento
          </Text>

          <ContentInfo>
            <Text>{item.obsPlanejamento}</Text>
          </ContentInfo>

          <Text color="#fff" fontWeight={600} bold fontSize={16} mt="5">
            Observações pós obra
          </Text>

          <ContentInfo>
            <Text bold>Observações gerais:</Text>
            <Text>{item.OBSERVACAO.obs}</Text>

            <Text bold>Quantidade de equipes para finalizar: </Text>
            <Text>{item.OBSERVACAO.qnt}</Text>

            <Text bold>Porcentagem concluída</Text>
            <Text>{item.OBSERVACAO.porcentual}</Text>

            <Text bold>Quantidade de tempo para finalizar:</Text>
            <Text>{item.OBSERVACAO.time} horas</Text>
          </ContentInfo>
        </Container>
      </ScrollView>
    </>
  );
}
