import {
  Box,
  TextArea,
  useDisclose,
  Modal,
  Text,
  Center,
  Input,
  HStack,
} from "native-base";
import React, { useCallback, useState } from "react";
import { Alert, TouchableOpacity } from "react-native";
import fire from "@react-native-firebase/firestore";

interface Props {
  open: boolean;
  pres: () => void;
  id: string;
}

export function ObsParcial({ open, id, pres }: Props) {
  const [obsP, setObsP] = useState("");
  const [porcent, setPorcent] = useState(0);

  const submit = useCallback(() => {
    if (obsP === "" && porcent === 0) {
      return Alert.alert("Informaçoes são obrigatórias");
    }
    fire()
      .collection("notas")
      .doc(id)
      .update({
        OBSERVACAO: obsP,
        PORCENTUAL: porcent / 100,
        situation: "parcial",
      })
      .then(() => {})
      .finally(() => {
        pres();
      });
  }, [id, obsP, porcent, pres]);

  return (
    <Modal top="-100" isOpen={open}>
      <Box bg="dark.900" w="100%" p="10">
        <TextArea onChangeText={setObsP} h="300" />

        <Text mt="10">Obra concluida</Text>
        <HStack>
          <Input
            keyboardType="numeric"
            onChangeText={(h) => setPorcent(Number(h))}
            w="100"
            h="10"
          />
          <Text fontSize={26}> %</Text>
        </HStack>

        <TouchableOpacity onPress={submit}>
          <Center bg="dark.400" p="2" borderRadius={10} mt="10">
            <Text fontSize={18}>OK</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </Modal>
  );
}
