/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { eachDayOfInterval, format } from "date-fns";
import { Box, FlatList, Input, ScrollView, Text } from "native-base";
import React, { useContext, useState } from "react";
import { Dimensions, Platform } from "react-native";
import { Cards } from "../components/cards";
import { Header } from "../components/header";
import { NotasContext } from "../context/ListNotas";
import { IProsEster } from "../dtos";
import { theme } from "../global/theme";
import { useAuth } from "../hooks/AuthContext";
import { ContentData, ContentNotas, TouchData } from "./styles/home";

const w = Dimensions.get("window").width / 2;

export function Home() {
  const { navigate } = useNavigation();

  const { colors } = theme;
  const { estera, GDS, ntCancelada, ntReprogramada } = useContext(NotasContext);
  const { user, signOut } = useAuth();

  const [mode, setMode] = useState("date");
  const [modeB, setModeB] = useState("date");
  const [show, setShow] = useState(false);
  const [showB, setShowB] = useState(false);
  const [date, setDate] = React.useState(new Date());
  const [dateB, setDateB] = React.useState(new Date());

  const [search, setSearch] = React.useState("");

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

  const notas = React.useMemo(() => {
    const filterNotaByDate: IProsEster[] = [];

    const filSearch =
      search !== ""
        ? estera.filter((i) => {
            if (i.Nota.includes(search)) {
              return i;
            }
          })
        : estera;

    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        filSearch.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            filterNotaByDate.push(item);
          }
        });
      });
    }

    const base = [];
    const proces = [];
    const executada = [];
    const parcial = [];
    const cancelada = [];
    let total = 0;

    filterNotaByDate.forEach((i) => {
      const vlE = 0;
      const vlP = 0;

      if (i.situation === "estera" && user.type !== "supervisor") {
        base.push(i);
        const vl = vlE + i.MO;
        total += i.MO;
      }

      if (i.situation === "processo") {
        if (user.type === "adm" || user.nome === i.SUPERVISOR) {
          proces.push(i);
          const vl = vlP + i.MO;
          total += i.MO;
        }
      }

      if (i.situation === "executada") {
        if (user.type === "adm" || user.nome === i.SUPERVISOR) {
          executada.push(i);
        }
      }

      if (i.situation === "parcial") {
        if (user.type === "adm" || user.nome === i.SUPERVISOR) {
          parcial.push(i);
        }
      }

      if (i.situation === "cancelada") {
        if (user.type === "adm" || user.nome === i.SUPERVISOR) {
          cancelada.push(i);
        }
      }
      total = vlE + vlP;
    });

    return {
      total,
      base,
      proces,
      executada,
      parcial,
      cancelada,
    };
  }, [date, dateB, estera, search, user]);

  const handleNavigateInfo = React.useCallback(
    (item: IProsEster) => {
      navigate("infoNota", { item });
    },
    [navigate]
  );

  const navigatetratativa = React.useCallback(
    (item: IProsEster, type: string) => {
      navigate("tratativa", { item, type });
    },
    [navigate]
  );

  const navigateExecutada = React.useCallback(
    (item: IProsEster) => {
      navigate("executada", { item });
    },
    [navigate]
  );

  return (
    <Box flex="1" bg="#454545">
      <Header />

      <ContentData>
        <Box>
          <TouchData onPress={showDatepicker}>
            <Text color="#ffffff">{format(date, "dd/MM/yy")}</Text>
          </TouchData>
        </Box>

        <Box>
          <TouchData onPress={showDatepickerB}>
            <Text color="#ffffff">{format(dateB, "dd/MM/yy")}</Text>
          </TouchData>
        </Box>

        <Input
          placeholder="pesquisar nota"
          w="40"
          h={10}
          onChangeText={setSearch}
          keyboardType="numeric"
          color="#fff"
        />

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
      </ContentData>

      <Text color="#fff">Total MO R$ {notas.total}</Text>

      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <ContentNotas>
          <Text ml={10} color="#fe7012" bold fontSize={14}>
            Notas na base
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas.base}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards
                info={() => handleNavigateInfo(i)}
                color="rgba(151, 147, 147, 0.187)"
                nota={i}
              />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          {notas.proces.length > 0 && (
            <Text ml={10} color="#cdcdcd" bold fontSize={14}>
              Notas com os encarregados
            </Text>
          )}
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas.proces}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards
                info={() => handleNavigateInfo(i)}
                color="#fff"
                nota={i}
                finish={() => navigateExecutada(i)}
                partial={() => navigatetratativa(i, "partial")}
                canceled={() => navigatetratativa(i, "canceled")}
              />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          {notas.executada.length > 0 && (
            <Text ml={10} color="#21ff6b" bold fontSize={14}>
              Notas parciais
            </Text>
          )}
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas.executada}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards
                info={() => handleNavigateInfo(i)}
                color={colors.green[600]}
                nota={i}
              />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          {notas.parcial.length > 0 && (
            <Text ml={10} color="#fdc938" bold fontSize={14}>
              Notas parciais
            </Text>
          )}
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas.parcial}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards
                info={() => handleNavigateInfo(i)}
                color={colors.yellow[600]}
                nota={i}
              />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          {notas.cancelada.length > 0 && (
            <Text ml={10} color="#ff4848" bold fontSize={14}>
              Notas parciais
            </Text>
          )}
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas.cancelada}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards
                color={colors.danger[600]}
                nota={i}
                info={() => handleNavigateInfo(i)}
              />
            )}
          />
        </ContentNotas>
      </ScrollView>
    </Box>
  );
}
