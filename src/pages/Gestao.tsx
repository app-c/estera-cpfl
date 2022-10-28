/* eslint-disable no-return-assign */
import {
  Box,
  Button,
  Center,
  HStack,
  Input,
  Modal,
  ScrollView,
  Text,
} from "native-base";
import React, { useCallback, useContext, useMemo, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, TouchableOpacity } from "react-native";
import { add, addDays, eachDayOfInterval, format } from "date-fns";
import { Feather } from "expo-vector-icons";
import { addMonths } from "date-fns/esm";
import { useNavigation } from "@react-navigation/native";
import { NotasContext } from "../context/ListNotas";
import { CardGestao } from "../components/CadsGestao";
import { IC4 } from "../dtos";
import { theme } from "../global/theme";

interface IProps {
  valor: number;
  data: string;
  situation?:
    | "estera"
    | "processo"
    | "parcial"
    | "executada"
    | "cancelada"
    | "retorno_parcial";
}

export function Gestao() {
  const { estera, c4, emergencia } = useContext(NotasContext);
  const { navigate } = useNavigation();

  const [valor, setValor] = React.useState(0);
  const [modalNewFaturamento, setModalNewFaturamento] = React.useState(false);

  function dateN() {
    const dia = addMonths(new Date(), -1);
    const ano = new Date().getFullYear();
    const mes = new Date().getMonth() + 1;
    const dt = new Date(ano, mes - 1, 28);
    return dt;
  }

  const [date, setDate] = React.useState(dateN);
  const [dateB, setDateB] = React.useState(new Date(addDays(date, 30)));

  const adMonth = useCallback(() => {
    const m = addMonths(date, 1);
    const ano = m.getFullYear();
    const mes = m.getMonth();
    setDate(new Date(ano, mes, 28));
    setDateB(new Date(ano, mes + 1, 28));
  }, [date]);

  const subMonth = useCallback(() => {
    const m = addMonths(date, -1);
    const ano = m.getFullYear();
    const mes = m.getMonth();
    setDate(new Date(ano, mes, 28));
    setDateB(new Date(ano, mes + 1, 28));
  }, [date]);

  const totalEstera = useMemo(() => {
    const filNotas = [];
    const filC4 = [];
    const filEmergencia = [];

    const nt = estera.map((h) => {
      return {
        valor: h.MO,
        data: h.Dt_programação,
        situation: h.situation,
      };
    });

    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        nt.forEach((item) => {
          if (fomatDt === item.data) {
            filNotas.push(item);
          }
        });

        c4.forEach((h) => {
          if (h.data === fomatDt) {
            filC4.push(h);
          }
        });

        emergencia.forEach((h) => {
          if (h.data === fomatDt) {
            filEmergencia.push(h);
          }
        });
      });
    }

    const nota = filNotas.length > 0 ? filNotas : [];

    const testera = nota.reduce((ac, item: IProps) => {
      if (item.situation === "estera") {
        ac += Number(item.valor);
      }
      return ac;
    }, 0);
    const texec = nota.reduce((ac, item: IProps) => {
      if (item.situation === "executada") {
        ac += Number(item.valor);
      }
      return ac;
    }, 0);

    const tparci = nota.reduce((ac, item: IProps) => {
      if (item.situation === "parcial") {
        ac += Number(item.valor);
      }
      return ac;
    }, 0);

    const tlC4 = filC4.reduce((ac, i: IC4) => {
      return (ac += Number(i.valor));
    }, 0);

    const tlPlan = testera + texec + tparci;
    const tlTotal = texec + tlC4;

    console.log(tlTotal);
    const total = testera.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const exec = texec.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const parc = tparci.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const plan = tlPlan.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return {
      total,
      exec,
      plan,
      parc,
    };
  }, [c4, date, dateB, emergencia, estera]);

  const submitExec = useCallback(() => {
    navigate("executada", { date, dateB });
  }, [date, dateB, navigate]);

  const submitParcial = useCallback(() => {
    navigate("parcial", { date, dateB });
  }, [date, dateB, navigate]);

  const submit = React.useCallback(() => {
    fire().collection("faturamento").add({
      valor,
    });
  }, []);

  return (
    <Box p="10" bg="white.50">
      <Modal isOpen={modalNewFaturamento}>
        <Center flex="1" w="100%" bg="white.100">
          <HStack alignItems="center" justifyContent="space-between" w="80%">
            <Text>Gerar novo faturamento</Text>
            <TouchableOpacity onPress={() => setModalNewFaturamento(false)}>
              <Box alignSelf="flex-start" p="5">
                <Feather
                  name="x-circle"
                  size={26}
                  color={theme.colors.orange[10]}
                />
              </Box>
            </TouchableOpacity>
          </HStack>
          <Box p="10" w="100%">
            <Input
              mb="10"
              placeholder="digite o valor do faturamento"
              keyboardType="numeric"
              onChangeText={(h) => setValor(Number(h))}
              borderColor="dark.50"
            />

            <Button onPress={() => {}}>CRIAR</Button>
          </Box>
        </Center>
      </Modal>
      <Center mb="10" mt="5">
        <HStack alignItems="center" space="10">
          <TouchableOpacity onPress={subMonth}>
            <Feather name="chevron-left" size={30} />
          </TouchableOpacity>
          <Box bg="blue.10" p="2" borderRadius="4">
            <Text color="#fff" bold fontSize={16}>
              {" "}
              do Mês de {format(date, "MM/yy")}
            </Text>
          </Box>
          <TouchableOpacity onPress={adMonth}>
            <Box>
              <Feather name="chevron-right" size={30} />
            </Box>
          </TouchableOpacity>
        </HStack>
      </Center>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <HStack justifyContent="space-between">
          <CardGestao color="dark.700" title="ORÇADO" valor="R$ 100.000,00" />
          <CardGestao color="dark.700" title="TOTAL" valor="R$" />
        </HStack>

        <CardGestao
          color="blueGray.400"
          title="PLANEJADO"
          valor={totalEstera.plan}
        />
        <CardGestao
          pres={submitExec}
          color="green.10"
          title="EXECUTADO 100%"
          valor={totalEstera.exec}
        />
        <CardGestao
          pres={submitParcial}
          color="orange.10"
          title="PARCIAL"
          valor={totalEstera.parc}
        />
        <CardGestao color="fuchsia.800" title="EMERGÊNCIA" valor="R$" />
        <CardGestao color="emerald.600" title="C4" valor="R$" />
        <Button onPress={() => setModalNewFaturamento(true)}>
          NOVO FATURAMENTO
        </Button>
      </ScrollView>
    </Box>
  );
}
