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
  ScrollView,
} from "native-base";
import React, { useCallback, useState } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import fire from "@react-native-firebase/firestore";
import { IPropsEquipe } from "../dtos";
import { Slect } from "./select";

interface Props {
  open: boolean;
  pres: () => void;
  id: string;
  equipe: IPropsEquipe[];
}

export function ObsFinalizada({ open, id, pres, equipe }: Props) {
  const w = Dimensions.get("window").width;
  const [obsP, setObsP] = useState("");
  const [porcent, setPorcent] = useState(0);
  const [qntEqp, setQntEqp] = React.useState(0);
  const [eqp, setEqp] = React.useState<IPropsEquipe[]>(equipe);
  const [tempo, setTempo] = React.useState("");

  const submit = useCallback(() => {
    fire()
      .collection("notas")
      .doc(id)
      .update({
        OBSERVACAO: obsP,
        situation: "executada",
        EQUIPE: eqp,
      })
      .finally(() => {
        pres();
      });
  }, [eqp, id, obsP, pres]);

  const selectEquipeMobilidade = React.useCallback(
    (gd: IPropsEquipe) => {
      const dt = {
        ...gd,
        mobilidade: !gd.mobilidade,
      };

      const gds: IPropsEquipe[] = [];
      gds.push(dt);
      eqp.forEach((h) => {
        if (h.id !== dt.id) {
          gds.push(h);
        }
      });

      setEqp(gds);
    },
    [eqp]
  );

  const GDS = React.useMemo(() => {
    return eqp.sort((a, b) => {
      if (a.equipe < b.equipe) {
        return -1;
      }
    });
  }, [eqp]);

  return (
    <Modal isOpen={open}>
      <ScrollView>
        <Box bg="dark.900" w={w} p="10">
          <TextArea onChangeText={setObsP} h="200" />

          <Text mt="5">Equipes fizeram mobilidade?</Text>
          <Box mt="2">
            <HStack space={4}>
              {GDS.map((h, i) => (
                <Center key={h.id}>
                  <Text>{h.equipe}</Text>
                  <Slect
                    presSelect={() => {
                      selectEquipeMobilidade(h);
                    }}
                    select={h.mobilidade}
                  />
                  <Text>sim</Text>
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
      </ScrollView>
    </Modal>
  );
}
