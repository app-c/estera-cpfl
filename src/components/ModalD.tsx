/* eslint-disable no-unused-expressions */
/* eslint-disable camelcase */
import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  ScrollView,
  Text,
  VStack,
} from "native-base";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import fire from "@react-native-firebase/firestore";
import * as Linking from "expo-linking";
import { IPropsEquipe, IProsEster } from "../dtos";
import { ObsParcial } from "./ObsParcial";
import { useAuth } from "../hooks/AuthContext";
import { ObsCancelada } from "./ObsCancelada";
import { ObsFinalizada } from "./ObsFinalizada";

interface Props {
  estera: IProsEster;
  closedModal: () => void;
  openUpdateEquipe: () => void;
  situation:
    | "estera"
    | "processo"
    | "parcial"
    | "executada"
    | "cancelada"
    | "retorno_parcial"
    | "nt_parcial"
    | "nt_cancelada";
}

export function ModalD({
  estera,
  closedModal,
  situation,
  openUpdateEquipe,
}: Props) {
  const w = Dimensions.get("window").width;
  const { user } = useAuth();
  const [modaObs, setModalObs] = useState(false);
  const [modaObsCan, setModalObsCan] = useState(false);
  const [modaObsExc, setModalObsExc] = useState(false);

  const [nota, setNota] = useState<IProsEster>(estera);

  const upNota = React.useCallback(() => {
    fire()
      .collection("notas")
      .onSnapshot((h) => {
        const nt = h.docs.map((p) => p.data() as IProsEster);

        const fil = nt.map((p) => {
          return {
            ...p,
          };
        });

        setNota(fil.find((p) => p.Nota === estera.Nota));
      });
  }, [estera]);

  const upObs = useCallback(() => {
    setModalObs(false);
    setModalObsCan(false);
    setModalObsExc(false);
    closedModal();
    upNota();
  }, [closedModal, upNota]);

  const nt_finalizada = useCallback(() => {
    fire()
      .collection("notas")
      .doc(estera.id)
      .update({
        situation: "executada",
      })
      .then(() => {
        closedModal();
      });
  }, [closedModal, estera]);

  const reprogramar = React.useCallback(() => {
    const dt = {
      ...nota,
      situation: "nt_parcial",
    };

    fire()
      .collection("nt-parcial")
      .add(dt)
      .then(() => {
        fire()
          .collection("notas")
          .doc(estera.id)
          .delete()
          .then(() => {
            Alert.alert("Nota reprogramada");
            closedModal();
          });
      });
  }, [closedModal, estera, nota]);

  const cancelada = React.useCallback(() => {
    fire()
      .collection("nt-cancelada")
      .add(estera)
      .then(() => {
        fire()
          .collection("notas")
          .doc(estera.id)
          .delete()
          .then(() => {
            Alert.alert("Nota salva para futuras informaçoes");
            closedModal();
          });
      });
  }, [closedModal, estera]);

  const ntProcesso = React.useCallback(() => {
    const eq = nota.EQUIPE || null;
    if (eq === null || nota.SUPERVISOR === undefined || eq.length === 0) {
      return Alert.alert("Equipe e supervisor é obrigatorio");
    }
    fire()
      .collection("notas")
      .doc(estera.id)
      .update({
        situation: "processo",
      })
      .then((h) => closedModal());
  }, [closedModal, estera, nota]);

  const map = `https://www.google.com/maps/search/?api=1&query=${estera.Lati}%2C$0}`;

  return (
    <Box flex="1" w="100%" alignSelf="center" pb="5" px="5" bg="dark.800">
      <ObsParcial
        equipe={estera.EQUIPE}
        pres={upObs}
        id={estera.id}
        open={modaObs}
      />

      <ObsCancelada
        equipe={estera.EQUIPE}
        pres={upObs}
        id={estera.id}
        open={modaObsCan}
      />

      <ObsFinalizada
        equipe={estera.EQUIPE}
        pres={upObs}
        id={estera.id}
        open={modaObsExc}
      />

      <HStack justifyContent="space-between">
        <Button onPress={closedModal} w={w * 0.2}>
          fechar
        </Button>

        {situation === "estera" && (
          <HStack>
            <TouchableOpacity onPress={openUpdateEquipe}>
              <Box bg="green.400" borderRadius={10} px="10" py="3">
                <Text bold>Atualizar</Text>
              </Box>
            </TouchableOpacity>
          </HStack>
        )}

        {situation === "nt_parcial" && (
          <TouchableOpacity onPress={openUpdateEquipe}>
            <Box bg="green.400" borderRadius={10} px="10" py="3">
              <Text bold>Atualizar</Text>
            </Box>
          </TouchableOpacity>
        )}

        {situation === "nt_cancelada" && (
          <TouchableOpacity onPress={openUpdateEquipe}>
            <Box bg="green.400" borderRadius={10} px="10" py="3">
              <Text bold>Atualizar</Text>
            </Box>
          </TouchableOpacity>
        )}
      </HStack>

      <Text mt="5" mb="3" bold fontSize={20}>
        NOTA: {estera.Nota}
      </Text>

      <ScrollView>
        <VStack alignSelf="flex-start">
          <Box w="100%" p="2" bg="dark.700">
            <Text>Texto_das_medidas: {estera.TLE}</Text>
            <Text>Dt_programação: {estera.Dt_programação}</Text>
            <Text>MO: {estera.MO}</Text>
            {nota && (
              <Box>
                <Text>SUPERVISOR: {nota.SUPERVISOR}</Text>
                <Text>SITUAÇÃO: {nota.situation}</Text>
                <Text>Porcentual: {nota.PORCENTUAL}</Text>
                {nota && (
                  <Box>
                    {nota.EQUIPE.map((h) => (
                      <HStack space={4}>
                        <Text key={h.equipe}>{h.equipe}</Text>
                        {situation !== "estera" && (
                          <Text>
                            {h.mobilidade === true
                              ? "movilidade: Sim"
                              : "movilidade: Não"}
                          </Text>
                        )}
                      </HStack>
                    ))}
                  </Box>
                )}
              </Box>
            )}

            <Box bg="yellow.500">
              <Text bold>Observações: </Text>
              <Text>{nota ? nota.OBSERVACAO : ""}</Text>
            </Box>
          </Box>
          <Box mt="5">
            {/* <Button
              onPress={() => {
                Linking.openURL(map);
              }}
            >
              LOCALIZAÇÃO
            </Button> */}
          </Box>
          {/* <Text>Tipo: {estera.Tipo}</Text>
          <Text>Descricao_da_nota: {estera.Descricao_da_nota}</Text>
          <Text>TAM: {estera.TAM}</Text>
          <Text>Depart: {estera.Depart}</Text>
          <Text>Divisão: {estera.Divisão}</Text>
          <Text>Bop: {estera.Bop}</Text>
          <Text>Cidade: {estera.Cidade}</Text>
          <Text>Distribuidora: {estera.Distribuidora}</Text>
          <Text>Fábrica: {estera.Fábrica}</Text>
          <Text>Status: {estera.Status}</Text>
          <Text>Código: {estera.Código}</Text>
          <Text>Texto_cod_medida: {estera.Texto_cod_medida}</Text>
          <Text>Dt_Criação: {estera.Dt_Criação}</Text>
          <Text>Local_inst: {estera.Local_inst}</Text>

          <Text>Alimentador: {estera.Alimentador}</Text>
          <Text>Conjunto_elétrico: {estera.Conjunto_elétrico}</Text>
          <Text>Qtde_clientes: {estera.Qtde_clientes}</Text>
          <Text>CHI_max: {estera.CHI_max}</Text>
          <Text>Obra_livre: {estera.Obra_livre}</Text>
          <Text>Nota_pai: {estera.Nota_pai}</Text>
          <Text>Possui_DI: {estera.Possui_DI}</Text>
          <Text>Num_DI: {estera.Num_DI}</Text>
          <Text>Possui_viab: {estera.Possui_viab}</Text>
          <Text>Data_viab: {estera.Data_viab}</Text>
          <Text>Dt_Empreita: {estera.Dt_Empreita}</Text>
          <Text>Mês_empreita: {estera.Mês_empreita}</Text>
          <Text>Ano_empreita: {estera.Ano_empreita}</Text>
          <Text>Km: {estera.Km}</Text>
          <Text>CAPEX: {estera.CAPEX}</Text> */}
        </VStack>
      </ScrollView>

      {estera.situation === "estera" && (
        <Center>
          <Button onPress={ntProcesso} mt="10">
            ENVIAR PARA O SUPERVISOR
          </Button>
        </Center>
      )}

      {estera.situation === "parcial" && (
        <HStack justifyContent="space-between">
          <Button bg="green.10" onPress={reprogramar} mt="5">
            FINALIZAR
          </Button>

          {user.type === "adm" && (
            <Button onPress={reprogramar} mt="5">
              REPROGRAMAR
            </Button>
          )}
        </HStack>
      )}

      {estera.situation === "cancelada" && user.type !== "supervisor" && (
        <Button onPress={cancelada} mt="5">
          Retirar da estera
        </Button>
      )}

      {estera.situation === "processo" && (
        <HStack justifyContent="space-between">
          <Button bg="green.600" onPress={() => setModalObsExc(true)} mt="10">
            100%
          </Button>

          <Button bg="yellow.300" onPress={() => setModalObs(true)} mt="10">
            PARCIAL
          </Button>

          <Button bg="red.600" onPress={() => setModalObsCan(true)} mt="10">
            NT-CANCELADA
          </Button>
        </HStack>
      )}
    </Box>
  );
}
