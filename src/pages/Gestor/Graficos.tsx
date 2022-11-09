/* eslint-disable no-return-assign */
import React, { useContext, useState } from "react";
import { Box, Center, HStack, Text } from "native-base";
import {
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
} from "victory-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform, ScrollView, TouchableOpacity } from "react-native";
import { eachDayOfInterval, format } from "date-fns";
import { Header } from "../../components/header";
import { NotasContext } from "../../context/ListNotas";
import { IProsEster } from "../../dtos";
import { theme } from "../../global/theme";
import { useAuth } from "../../hooks/AuthContext";
import { categoria } from "../../utilis/categoria";

interface Props {
  par: IProsEster[];
  pla: IProsEster[];
  exe: IProsEster[];
  canc: IProsEster[];
}

export function Graficos() {
  const { notasByDate, notasPorData, estera } = useContext(NotasContext);
  const { user } = useAuth();
  const [mode, setMode] = useState("date");
  const [modeB, setModeB] = useState("date");
  const [show, setShow] = useState(false);
  const [showB, setShowB] = useState(false);
  const [date, setDate] = React.useState(new Date());
  const [dateB, setDateB] = React.useState(new Date());

  React.useEffect(() => {
    notasByDate(date, dateB);
  }, [date, dateB, notasByDate]);

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

  const onChangeB = React.useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setShowB(false);
    setDateB(currentDate);
  }, []);

  const showModeB = React.useCallback((currentMode) => {
    if (Platform.OS === "android") {
      setShowB(true);
      // for iOS, add a button that closes the picker
    }
    setModeB(currentMode);
  }, []);

  const showDatepickerB = React.useCallback(() => {
    showModeB("date");
  }, [showModeB]);

  const nt = React.useMemo(() => {
    const planejado = notasPorData.pla ? notasPorData.pla : [];
    const executado = notasPorData.exe ? notasPorData.exe : [];
    const parcial = notasPorData.par ? notasPorData.par : [];
    const cancelada = notasPorData.canc ? notasPorData.canc : [];

    const supervisor = {
      Adelino: {
        planejado: planejado.filter((h) => h.SUPERVISOR === "Adelino").length,
        executado: executado.filter((h) => h.SUPERVISOR === "Adelino").length,
        parcial: parcial.filter((h) => h.SUPERVISOR === "Adelino").length,
        cancelada: cancelada.filter((h) => h.SUPERVISOR === "Adelino").length,
      },

      Diego: {
        planejado: planejado.filter((h) => h.SUPERVISOR === "Diego").length,
        executado: executado.filter((h) => h.SUPERVISOR === "Diego").length,
        parcial: parcial.filter((h) => h.SUPERVISOR === "Diego").length,
        cancelada: cancelada.filter((h) => h.SUPERVISOR === "Diego").length,
      },

      Douglas: {
        planejado: planejado.filter((h) => h.SUPERVISOR === "Douglas").length,
        executado: executado.filter((h) => h.SUPERVISOR === "Douglas").length,
        parcial: parcial.filter((h) => h.SUPERVISOR === "Douglas").length,
        cancelada: cancelada.filter((h) => h.SUPERVISOR === "Douglas").length,
      },

      Paulo: {
        planejado: planejado.filter((h) => h.SUPERVISOR === "Paulo").length,
        executado: executado.filter((h) => h.SUPERVISOR === "Paulo").length,
        parcial: parcial.filter((h) => h.SUPERVISOR === "Paulo").length,
        cancelada: cancelada.filter((h) => h.SUPERVISOR === "Paulo").length,
      },
    };

    const data = [
      {
        x: `Aldelino ${supervisor.Adelino.planejado}`,
        y: supervisor.Adelino.executado,
        label: supervisor.Adelino.executado,
      },
      {
        x: `Diego ${supervisor.Diego.planejado - 1}`,
        y: supervisor.Diego.executado,
        label: supervisor.Diego.executado,
      },
      {
        x: `Douglas ${supervisor.Douglas.planejado - 1}`,
        y: supervisor.Douglas.executado,
        label: supervisor.Douglas.executado,
      },

      {
        x: `Paulo ${supervisor.Paulo.planejado}`,
        y: supervisor.Paulo.executado,
        label: supervisor.Paulo.executado,
      },
    ];

    const dataP = [
      {
        x: `Aldelino ${supervisor.Adelino.planejado}`,
        y: supervisor.Adelino.parcial,
        label: supervisor.Adelino.parcial,
      },
      {
        x: `Diego ${supervisor.Diego.planejado - 1}`,
        y: supervisor.Diego.parcial,
        label: supervisor.Diego.parcial,
      },
      {
        x: `Douglas ${supervisor.Douglas.planejado - 1}`,
        y: supervisor.Douglas.parcial,
        label: supervisor.Douglas.parcial,
      },

      {
        x: `Paulo ${supervisor.Paulo.planejado}`,
        y: supervisor.Paulo.parcial,
        label: supervisor.Paulo.parcial,
      },
    ];

    const dataC = [
      {
        x: `Aldelino ${supervisor.Adelino.planejado}`,
        y: supervisor.Adelino.cancelada,
        label: supervisor.Adelino.cancelada,
      },
      {
        x: `Diego ${supervisor.Diego.planejado - 1}`,
        y: supervisor.Diego.cancelada,
        label: supervisor.Diego.cancelada,
      },
      {
        x: `Douglas ${supervisor.Douglas.planejado - 1}`,
        y: supervisor.Douglas.cancelada,
        label: supervisor.Douglas.cancelada,
      },

      {
        x: `Paulo ${supervisor.Paulo.planejado}`,
        y: supervisor.Paulo.cancelada,
        label: supervisor.Paulo.cancelada,
      },
    ];

    const dados = {
      dataC,
      dataP,
      data,
    };

    return dados;
  }, [notasPorData]);

  const ntGlbal = React.useMemo(() => {
    const res = estera.map((h) => {
      const tl = Number(h.MO);

      const total = tl.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });
      return {
        ...h,
        MO: tl,
        price: total,
      };
    });

    const filterWihDate = [];

    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        res.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            filterWihDate.push(item);
          }
        });
      });
    }

    const nota = filterWihDate.length > 0 ? filterWihDate : res;

    // const pr = Number(h.MO) * h.PORCENTUAL;
    // const total = pr.toLocaleString("pt-BR", {
    //   style: "currency",
    //   currency: "BRL",
    // });

    const notaTotal = nota.reduce((ac: number, h) => {
      return (ac += Number(h.MO));
    }, 0);

    const subTotal: PropsPip[] = [];

    categoria.forEach((cat) => {
      let notaN = "";
      let sum = 0;
      nota.forEach((item: IProsEster) => {
        if (cat.name === item.situation) {
          const porcent = item.PORCENTUAL || 0;
          sum += Number(item.MO) - item.MO * porcent;
          notaN = item.Nota;
        }
      });

      const totalF = sum.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      const prc = ((sum / notaTotal) * 100).toFixed(0);

      const percent = `${prc}%`;

      subTotal.push({
        nota: notaN,
        total: sum,
        totalFormated: totalF,
        situation: cat.name,
        color: cat.color,
        percent,
      });
    });

    return subTotal;
  }, [estera, date, dateB]);

  return (
    <Box flex="1">
      <Header />
      <Text>Graficos</Text>

      <HStack mb="10" mt="5" space={10}>
        <TouchableOpacity onPress={showDatepicker}>
          <Box bg="dark.400" p="2" borderRadius="4">
            <Text color="#fff" bold fontSize={16}>
              {" "}
              do dia: {format(date, "dd/MM/yy")}
            </Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={showDatepickerB}>
          <Box bg="dark.400" p="2" borderRadius="4">
            <Text color="#fff" bold fontSize={16}>
              {" "}
              ao dia: {format(dateB, "dd/MM/yy")}
            </Text>
          </Box>
        </TouchableOpacity>
      </HStack>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour
          onChange={onChange}
        />
      )}

      {showB && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateB}
          mode={modeB}
          is24Hour
          onChange={onChangeB}
        />
      )}

      <ScrollView contentContainerStyle={{ paddingBottom: 300 }}>
        <Center>
          <Text bold fontSize="18">
            Visão geral de produção
          </Text>
          <VictoryPie
            colorScale={categoria.map((h) => h.color)}
            data={ntGlbal}
            x="percent"
            y="total"
          />
        </Center>

        <Center>
          <Text top="5" bold fontSize={18}>
            Produção dos encarregados
          </Text>
          <VictoryChart domainPadding={40}>
            <VictoryGroup
              offset={15}
              colorScale={[
                theme.colors.green[10],
                theme.colors.orange[10],
                theme.colors.red[10],
              ]}
            >
              <VictoryBar data={nt.data} />
              <VictoryBar data={nt.dataP} />
              <VictoryBar data={nt.dataC} />
            </VictoryGroup>
          </VictoryChart>
        </Center>
      </ScrollView>
    </Box>
  );
}
