import fire from "@react-native-firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Box, Center, Input, ScrollView, Text, TextArea } from "native-base";
import React from "react";
import { Alert, Dimensions } from "react-native";
import { Header } from "../../components/header";
import { IProsEster } from "../../dtos";
import {
  BoxButton,
  BoxContainer,
  BoxInfoAd,
  BoxVeiculos,
  Container,
  ObsText,
  Title
} from "./styles";

const w = Dimensions.get("screen").width;

type PropsFinish = "partial" | "canceled";

interface PropsRoute {
  item: IProsEster;
  type: PropsFinish;
}

export function Tratativa() {
  const route = useRoute();
  const { item, type } = route.params as PropsRoute;

  const [typeFinish, setTypeFinish] = React.useState<PropsFinish>(type);

  const [obs, setObs] = React.useState("");
  const [gd, setGd] = React.useState(0);
  const [lm, setLm] = React.useState(0);
  const [lv, setLv] = React.useState(0);
  const [time, setTime] = React.useState(0);
  const [porcent, setPorcent] = React.useState(0);

  const { navigate } = useNavigation();

  const handleSubmit = React.useCallback(() => {
    if (obs === "") {
      return Alert.alert("Erro", "Preencha as observações gerais");
    }

    if (time === 0) {
      return Alert.alert("Erro", "Informe quantidade de horas para finalizar");
    }

    if (gd === 0 && lm === 0 && lv === 0) {
      return Alert.alert("Erro", "Informe quantidade de veículos");
    }

    switch (typeFinish) {
      case "partial":
        fire()
          .collection("notas")
          .doc(item.id)
          .update({
            OBSERVACAO: {
              obs,
              qnt: `GD: ${gd}, LM: ${lm}, LV: ${lv}`,
              time,
              porcentual: porcent / 100,
            },
            situation: "parcial",
          })
          .then((h) => navigate("home"));

        break;

      case "canceled":
        fire()
          .collection("notas")
          .doc(item.id)
          .update({
            OBSERVACAO: {
              obs,
              qnt: `GD: ${gd}, LM: ${lm}, LV: ${lv}`,
              time,
              porcentual: porcent / 100,
            },
            situation: "cancelada",
          })
          .then((h) => navigate("home"));
        break;

      default:
        break;
    }
  }, [gd, item.id, lm, lv, obs, porcent, time, typeFinish]);

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
              onChangeText={setObs}
              _focus={{
                borderColor: "#ce5d21",
                backgroundColor: "#8a8a8a",
              }}
              fontSize={14}
              color="#fff"
              h={w * 0.4}
            />
          </Center>

          <Text color="#fff" mt="10">
            Quantidade de veículos para finalizar a obra
          </Text>

          <BoxVeiculos>
            <Center>
              <Text bold>GD</Text>
              <Input
                onChangeText={(h) => setGd(Number(h))}
                placeholderTextColor="#383838"
                h={10}
                w={20}
                placeholder="qnt"
                keyboardType="numeric"
                _focus={{
                  borderColor: "#ce5d21",
                  backgroundColor: "#acacac",
                }}
              />
            </Center>

            <Center>
              <Text bold>LM</Text>
              <Input
                onChangeText={(h) => setLm(Number(h))}
                placeholderTextColor="#383838"
                h={10}
                w={20}
                placeholder="qnt"
                keyboardType="numeric"
                _focus={{
                  borderColor: "#ce5d21",
                  backgroundColor: "#acacac",
                }}
              />
            </Center>

            <Center>
              <Text bold>LV</Text>
              <Input
                onChangeText={(h) => setLv(Number(h))}
                placeholderTextColor="#383838"
                h={10}
                w={20}
                placeholder="qnt"
                keyboardType="numeric"
                _focus={{
                  borderColor: "#ce5d21",
                  backgroundColor: "#acacac",
                }}
              />
            </Center>
          </BoxVeiculos>

          <Text color="#fff" mt="10">
            Informações adicionais
          </Text>

          <BoxInfoAd>
            <Box
              mb="5"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text bold>porcentagem da obra concluida</Text>
              <Input
                onChangeText={(h) => setPorcent(Number(h))}
                ml={2}
                placeholderTextColor="#383838"
                h={10}
                w={20}
                placeholder="%"
                keyboardType="numeric"
                _focus={{
                  borderColor: "#ce5d21",
                  backgroundColor: "#acacac",
                }}
              />
            </Box>
            <Box
              mb="5"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text bold>tempo necessário para concluir a obra</Text>
              <Input
                onChangeText={(h) => setTime(Number(h))}
                ml={2}
                placeholderTextColor="#383838"
                h={10}
                w={20}
                placeholder="horas"
                keyboardType="numeric"
                _focus={{
                  borderColor: "#ce5d21",
                  backgroundColor: "#acacac",
                }}
              />
            </Box>
          </BoxInfoAd>

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
