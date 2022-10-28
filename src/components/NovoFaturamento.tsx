import React from "react";
import { Box, Button, Center, Input, Text } from "native-base";
import fire from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { Alert } from "react-native";

export function NovoFaturamento() {
  const [evento, setEvento] = React.useState(0);
  const [valor, setValor] = React.useState(0);

  const submit = React.useCallback(() => {
    if (evento === 0 || valor === 0) {
      return Alert.alert("valor e envento são obrigatórios");
    }
    fire()
      .collection("c4")
      .add({
        valor,
        evento,
        data: format(new Date(), "dd/MM/yyyy"),
      });
  }, [evento, valor]);

  return (
    <Center flex="1" w="100%" bg="white.100">
      <Text>Gerar C4</Text>
      <Box p="10" w="100%">
        <Input
          mb="10"
          placeholder="digite o evento"
          keyboardType="numeric"
          onChangeText={(h) => setEvento(Number(h))}
          borderColor="dark.50"
        />
        <Input
          mb="10"
          placeholder="digite o evento"
          keyboardType="numeric"
          onChangeText={(h) => setValor(Number(h))}
          borderColor="dark.50"
        />

        <Button onPress={submit}>CRIAR</Button>
      </Box>
    </Center>
  );
}
