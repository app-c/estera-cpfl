/* eslint-disable no-return-assign */
import {
  Box,
  Button,
  Center,
  CheckIcon,
  FormControl,
  HStack,
  Input,
  Modal,
  ScrollView,
  Select,
  Text,
  WarningOutlineIcon
} from "native-base";

import fire from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { addDays, eachDayOfInterval, format } from "date-fns";
import { addMonths } from "date-fns/esm";
import { Feather } from "expo-vector-icons";
import React, { useCallback, useContext, useMemo } from "react";
import { Alert, Dimensions, TouchableOpacity } from "react-native";
import { CardGestao } from "../components/CadsGestao";
import { Header } from "../components/header";
import { NotasContext } from "../context/ListNotas";
import { IC4 } from "../dtos";
import { theme } from "../global/theme";
import { Meses } from "../utilis/meses";

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
  const { estera, c4, emergencia, faturamento, ntCancelada, ntReprogramada } =
    useContext(NotasContext);
  const { navigate } = useNavigation();
  const w = Dimensions.get("screen").width / 2;

  const [valor, setValor] = React.useState(0);
  const [modalNewFaturamento, setModalNewFaturamento] = React.useState(false);

  const [mes, setMes] = React.useState("");

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
    const filParc = [];
    const filCanc = [];
    const filC4 = [];
    const filEmergencia = [];

    const nt = estera.map((h) => {
      return {
        valor: h.MO,
        data: h.Dt_programação,
        situation: h.situation,
      };
    });

    const np = ntReprogramada.map((h) => {
      return {
        valor: h.MO,
        data: h.Dt_programação,
        situation: h.situation,
      };
    });

    const nc = ntCancelada.map((h) => {
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

        np.forEach((item) => {
          if (fomatDt === item.data) {
            filParc.push(item);
          }
        });

        nc.forEach((item) => {
          if (fomatDt === item.data) {
            filCanc.push(item);
          }
        });

        c4.forEach((h) => {
          if (h.data === fomatDt) {
            filC4.push(h);
          }
        });
        console.log(c4);

        emergencia.forEach((h) => {
          if (h.data === fomatDt) {
            filEmergencia.push(h);
          }
        });
      });
    }

    const fatFind = faturamento.find((h) => {
      const db = dateB.getMonth() + 1;
      const [dia, mes, ano] = h.data.split("/").map(Number);
      if (db === mes) {
        return h;
      }
    });

    const fatuV = fatFind ? fatFind.valor : 0;

    const nota = filNotas.length > 0 ? filNotas : [];
    const parcial = filParc.length > 0 ? filParc : [];
    const cancelada = filCanc.length > 0 ? filCanc : [];

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

    const tparci = parcial.reduce((ac, item: IProps) => {
      return (ac += Number(item.valor));
    }, 0);

    const tcancelada = cancelada.reduce((ac, item: IProps) => {
      return (ac += Number(item.valor));
    }, 0);

    const tlC4 = filC4.reduce((ac, i: IC4) => {
      return (ac += Number(i.valor));
    }, 0);

    const tlEmer = filEmergencia.reduce((ac, i: IC4) => {
      return (ac += Number(i.valor));
    }, 0);

    const tlPlan = testera + texec + tparci + tcancelada;
    const tlTotal = texec + tlC4 + tlEmer;

    const total = tlTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const fatu = fatuV.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const C4 = tlC4.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const Emer = tlEmer.toLocaleString("pt-BR", {
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
      valorFaturamento: fatuV,
      valorTotal: tlTotal,
      fatu,
      total,
      exec,
      plan,
      parc,
      C4,
      Emer,
    };
  }, [
    c4,
    date,
    dateB,
    emergencia,
    estera,
    faturamento,
    ntCancelada,
    ntReprogramada,
  ]);

  const submitExec = useCallback(() => {
    navigate("executada", { date, dateB });
  }, [date, dateB, navigate]);

  const submitParcial = useCallback(() => {
    navigate("parcial", { date, dateB });
  }, [date, dateB, navigate]);

  const submit = React.useCallback(() => {
    fire()
      .collection("faturamento")
      .add({
        valor,
        data: format(new Date().setMonth(Number(mes) - 1), "dd/MM/yyyy"),
      })
      .then(() => {
        Alert.alert("Faturamento criado");
      })
      .finally(() => {
        setModalNewFaturamento(false);
      });
  }, [mes, valor]);

  return (
    <>
      <Header />
      <Box px="10" bg="white.50">
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

              <FormControl w="100%">
                <FormControl.Label _text={{ color: "dark.10" }}>
                  Escolha um mes de referencia
                </FormControl.Label>
                <Select
                  minWidth="200"
                  selectedValue={mes}
                  onValueChange={(h) => setMes(h)}
                  accessibilityLabel="Choose Service"
                  placeholder="Choose Service"
                  color="dark.10"
                  mb="5"
                  _selectedItem={{
                    bg: "green.10",
                    endIcon: <CheckIcon color="white.50" size={5} />,
                  }}
                  mt="1"
                >
                  {Meses.map((h) => (
                    <Select.Item key={h.id} label={h.mes} value={h.id} />
                  ))}
                </Select>
                <FormControl.ErrorMessage
                  leftIcon={<WarningOutlineIcon size="xs" />}
                >
                  Please make a selection!
                </FormControl.ErrorMessage>
              </FormControl>
              <Button onPress={submit}>CRIAR</Button>
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
                mês de referência {format(dateB, "MM/yyyy")}
              </Text>
            </Box>
            <TouchableOpacity onPress={adMonth}>
              <Box>
                <Feather name="chevron-right" size={30} />
              </Box>
            </TouchableOpacity>
          </HStack>
        </Center>

        <HStack justifyContent="space-between">
          <Center
            borderRadius={10}
            mb="5"
            borderColor="blue.10"
            borderWidth="3"
            bg="white.100"
            px="2"
            w={w * 0.76}
          >
            <Text fontSize={18} bold>
              Faturamento
            </Text>

            <Text>{totalEstera.fatu}</Text>
          </Center>

          <Center
            borderRadius={10}
            mb="5"
            borderColor={
              totalEstera.valorTotal < totalEstera.valorFaturamento
                ? "red.10"
                : "green.10"
            }
            borderWidth="2"
            bg={
              totalEstera.valorTotal < totalEstera.valorFaturamento
                ? "red.100"
                : "green.100"
            }
            px="5"
            w={w * 0.7}
          >
            <Text fontSize={18} bold>
              Total
            </Text>

            <Text mt="2">{totalEstera.total}</Text>
          </Center>
        </HStack>

        <ScrollView contentContainerStyle={{ paddingBottom: 400 }}>
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
          <CardGestao
            color="fuchsia.800"
            title="EMERGÊNCIA"
            valor={totalEstera.Emer}
          />
          <CardGestao color="emerald.600" title="C4" valor={totalEstera.C4} />
          <Button onPress={() => setModalNewFaturamento(true)}>
            NOVO FATURAMENTO
          </Button>
        </ScrollView>
      </Box>
    </>
  );
}
