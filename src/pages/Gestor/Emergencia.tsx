import React, { useState } from "react";
import { Box, Button, Center, Input, Text } from "native-base";
import fire from "@react-native-firebase/firestore";
import { format } from "date-fns";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export function Emergencia() {
  const { navigate } = useNavigation();
  const [evento, setEvento] = React.useState(0);
  const [valor, setValor] = React.useState(0);

  const [mode, setMode] = useState("date");
  const [show, setShow] = React.useState(false);
  const [date, setDate] = React.useState(new Date());

  const onChange = React.useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  }, []);

  const showMode = React.useCallback((currentMode) => {
    if (Platform.OS === "android") {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  }, []);

  const showDatepicker = React.useCallback(() => {
    console.log("date");
    showMode("date");
  }, [showMode]);

  const submit = React.useCallback(() => {
    if (evento === 0 || valor === 0) {
      return Alert.alert("valor e envento são obrigatórios");
    }

    fire()
      .collection("emergencia")
      .add({
        valor,
        evento,
        data: format(new Date(), "dd/MM/yyyy"),
      })
      .then((h) => {
        Alert.alert("EVENTO CRIADO");
        navigate("home");
      });
  }, [evento, valor]);

  return (
    <Center bg="blue.50" flex="1">
      <Text>Gerar EMERGENCIA</Text>

      <Box w="100%" p="10">
        <Input
          mb="10"
          placeholder="digite o evento"
          onChangeText={(h) => setEvento(Number(h))}
          placeholderTextColor="dark.50"
          keyboardType="numeric"
          borderColor="dark.50"
        />
        <Input
          mb="10"
          placeholderTextColor="dark.50"
          placeholder="digite o valor do evento"
          keyboardType="numeric"
          borderColor="dark.50"
          onChangeText={(h) => setValor(Number(h))}
        />

        <TouchableOpacity onPress={showDatepicker}>
          <Box bg="white.50" w="40" borderRadius={5} p="2" mb="10">
            <Text>Selecione uma data</Text>
            <Text>{format(date, "dd/MM/yyyy")}</Text>
          </Box>
        </TouchableOpacity>

        <Button onPress={submit}>CRIAR</Button>
      </Box>
    </Center>
  );
}
