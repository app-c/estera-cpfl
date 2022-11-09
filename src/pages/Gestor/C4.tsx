import React, { useState } from "react";
import { Box, Button, Center, Input, Text } from "native-base";
import fire from "@react-native-firebase/firestore";
import { format, formatDistance } from "date-fns";
import { Alert, Platform, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

export function C4() {
  const { navigate, reset } = useNavigation();
  const [evento, setEvento] = React.useState(0);
  const [valor, setValor] = React.useState(0);
  const [date, setDate] = React.useState(new Date());

  const [mode, setMode] = useState("date");
  const [show, setShow] = React.useState(false);

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
    showMode("date");
  }, [showMode]);

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
  }, [date, evento, navigate, valor]);

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

        <TouchableOpacity onPress={showDatepicker}>
          <Box bg="white.50" w="40" borderRadius={5} p="2" mb="10">
            <Text>Selecione uma data</Text>
            <Text>{format(date, "dd/MM/yyyy")}</Text>
          </Box>
        </TouchableOpacity>

        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour
            onChange={onChange}
          />
        )}

        <Button onPress={submit}>CRIAR</Button>
      </Box>
    </Center>
  );
}
