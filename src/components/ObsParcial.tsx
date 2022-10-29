/* eslint-disable no-param-reassign */
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
import { IPropsEquipe } from "../dtos";
import { Slect } from "./select";

interface Props {
  open: boolean;
  pres: () => void;
  id: string;
  equipe: IPropsEquipe[];
}

export function ObsParcial({ open, id, pres, equipe }: Props) {
  const [obsP, setObsP] = useState("");
  const [porcent, setPorcent] = useState(0);
  const [qntEqp, setQntEqp] = React.useState(0);
  const [eqp, setEqp] = React.useState<IPropsEquipe[]>(equipe);

  const [equipes, setEquipes] = React.useState<IPropsEquipe[]>([]);
  const [idG, setIdG] = React.useState("");

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

  // const eq = React.useMemo(() => {
  //   const adIndex = equipe.findIndex((h) => h.id === idG);
  //   const fin = equipe.find((h) => h.id === idG);

  //   const dt = {
  //     ...fin,
  //     mobilidade: !!fin.mobilidade,
  //   };

  //   equipe[adIndex] = dt;

  //   return equipe;
  // }, [equipe, idG]);
  const e = [];

  const selectEquipeMobilidade = React.useCallback(
    (gd: number, mobi, id: string) => {
      // const adIndex = equipe.findIndex((h) => h.equipe === gd);
      const fin = equipe.find((h) => h.id === id);

      const dt = {
        ...fin,
        mobilidade: !mobi,
      };

      e.push(dt);

      equipe[gd] = dt;

      setEqp(equipe);
    },
    [e, equipe, eqp]
  );

  React.useEffect(() => {
    setEquipes(equipe);
  }, [equipe]);

  // console.log(equipes.map((h) => h.mobilidade));

  return (
    <Modal top="-100" isOpen={open}>
      <Box bg="dark.900" w="100%" p="10">
        <TextArea onChangeText={setObsP} h="200" />

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

        <Text mt="5">
          Quantidade de Equipe necessária para finalizar a obra:
        </Text>
        <Input
          keyboardType="numeric"
          onChangeText={(h) => setQntEqp(Number(h))}
          w="100"
          h="10"
        />

        <Text mt="5">Equipes fizeram mobilidade?</Text>
        <Box mt="2">
          <HStack space={3}>
            {equipes.map((h, i) => (
              <Center key={h.id}>
                <Text>{h.equipe}</Text>
                <Slect
                  presSelect={() => {
                    selectEquipeMobilidade(i, h.mobilidade, h.id);
                    setIdG(h.equipe);
                  }}
                  select={h.mobilidade}
                />
              </Center>
            ))}
          </HStack>
        </Box>

        <TouchableOpacity onPress={submit}>
          <Center bg="dark.400" p="2" borderRadius={10} mt="10">
            <Text fontSize={18}>OK</Text>
          </Center>
        </TouchableOpacity>
      </Box>
    </Modal>
  );
}
