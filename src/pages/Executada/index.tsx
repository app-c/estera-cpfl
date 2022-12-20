import fire from "@react-native-firebase/firestore";
import { useRoute } from "@react-navigation/native";
import { Box, Center, ScrollView, Text, TextArea } from "native-base";
import React, { useContext } from "react";
import { Dimensions } from "react-native";
import { Header } from "../../components/header";
import { NotasContext } from "../../context/ListNotas";
import { IProsEster } from "../../dtos";
import { BoxButton, BoxContainer, Container, ObsText, Title } from "./styles";

const w = Dimensions.get("screen").width;

type PropsFinish = "finish" | "partial" | "canceled";

export function Executada() {
  const { estera } = useContext(NotasContext);
  const route = useRoute();
  const item = route.params as IProsEster;

  const [typeFinish, setTypeFinish] = React.useState<PropsFinish>("partial");

  const [obs, setObs] = React.useState("");
  const [qnt, setQnt] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [porcent, setPorcent] = React.useState(100);

  const handleSubmit = React.useCallback(() => {
    fire()
      .collection("notas")
      .doc(item.id)
      .update({
        OBSERVACAO: {
          obs,
          qnt,
          time,
          porcentual: porcent / 100,
        },
        situation: "executada",
      });
  }, [item.id, obs, porcent, qnt, time]);

  return (
    <Container>
      <Header />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <BoxContainer>
          <Center>
            <Title>Descreva as informações pós obra</Title>
          </Center>

          <ObsText>Observações gerais</ObsText>

          <Center>
            <TextArea
              _focus={{
                borderColor: "#ce5d21",
                backgroundColor: "#8a8a8a",
              }}
              fontSize={14}
              color="#fff"
              h={w * 0.4}
            />
          </Center>

          <BoxButton onPress={handleSubmit}>
            <Box>
              <Text>Salvar</Text>
            </Box>
          </BoxButton>
        </BoxContainer>
      </ScrollView>
    </Container>
  );
}
