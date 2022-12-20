/* eslint-disable no-param-reassign */
import fire from "@react-native-firebase/firestore";
import {
  Box, Center, HStack, Input, Modal, ScrollView, Text, TextArea
} from "native-base";
import React, { useCallback, useState } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { IPropsEquipe } from "../dtos";
import { Slect } from "./select";

interface Props {
  open: boolean;
  pres: () => void;
  id: string;
  equipe: IPropsEquipe[];
}

export function ObsParcial({ open, id, pres, equipe }: Props) {
  const w = Dimensions.get("window").width;
  const [obsP, setObsP] = useState("");
  const [porcent, setPorcent] = useState(0);
  const [qntEqp, setQntEqp] = React.useState(0);
  const [eqp, setEqp] = React.useState<IPropsEquipe[]>(equipe);
  const [tempo, setTempo] = React.useState("");
  const [gd, setGd] = React.useState(0);
  const [lv, setLv] = React.useState(0);
  const [lm, setLm] = React.useState(0);

  const submit = useCallback(() => {
    if (obsP === "" || porcent === 0 || tempo === "") {
      return Alert.alert("Informaçoes são obrigatórias");
    }
    fire()
      .collection("notas")
      .doc(id)
      .update({
        OBSERVACAO: `${obsP} ${"\n"} Quantidade necessária de equipe para finalizar a obra: ${"\n"}GD: ${gd} ${"\n"}LM: ${lm} ${"\n"} ${lv}  ${"\n"} Quantidade de tempo para finalizar o obra: ${tempo} Hs`,
        PORCENTUAL: porcent / 100,
        situation: "parcial",
        EQUIPE: eqp,
      })
      .finally(() => {
        pres();
      });
  }, [eqp, gd, id, lm, lv, obsP, porcent, pres, tempo]);

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

          <HStack mt="5" alignItems="center" space={3}>
            <HStack space={3}>
              <Text>GD</Text>
              <Input
                keyboardType="numeric"
                onChangeText={(h) => setGd(Number(h))}
                w="60"
                h={w * 0.07}
                fontSize="14"
                padding={0}
                px="2"
              />
            </HStack>

            <HStack space={3}>
              <Text>LM</Text>
              <Input
                keyboardType="numeric"
                onChangeText={(h) => setLm(Number(h))}
                w="60"
                h={w * 0.07}
                fontSize="14"
                padding={0}
                px="2"
              />
            </HStack>

            <HStack space={3}>
              <Text>LV</Text>
              <Input
                keyboardType="numeric"
                onChangeText={(h) => setLv(Number(h))}
                w="60"
                h={w * 0.07}
                fontSize="14"
                padding={0}
                px="2"
              />
            </HStack>
          </HStack>

          <Text mt="5">Quantidade de tempo para finalizar a obra</Text>
          <Input
            keyboardType="numeric"
            onChangeText={(h) => setTempo(h)}
            w="100"
            h="10"
          />

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
