import React from "react";
import { Box, Button, Center, Input, Text } from "native-base";
import fire from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function C4() {
  const { navigate, reset } = useNavigation();
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
      })
      .then((h) => {
        Alert.alert("EVENTO CRIADO");
        navigate("home");
      });
  }, [evento, navigate, valor]);

  return (
    <Center flex="1" w="100%" bg="blue.50">
      <Text>Gerar C4</Text>
      <Box p="10" w="100%">
        <Input
          mb="10"
          placeholder="digite o evento"
          placeholderTextColor="dark.50"
          keyboardType="numeric"
          onChangeText={(h) => setEvento(Number(h))}
          borderColor="dark.50"
        />
        <Input
          placeholderTextColor="dark.50"
          mb="10"
          placeholder="digite o valor do evento"
          keyboardType="numeric"
          onChangeText={(h) => setValor(Number(h))}
          borderColor="dark.50"
        />

        <Button onPress={submit}>CRIAR</Button>
      </Box>
    </Center>
  );
}
