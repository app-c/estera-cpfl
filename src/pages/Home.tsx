/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import DateTimePicker from "@react-native-community/datetimepicker";
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

export function Home() {
  const { colors } = theme;
  const { estera, GDS, ntCancelada, ntReprogramada } = useContext(NotasContext);
  const { user, signOut } = useAuth();

  const w = Dimensions.get("window").width / 2;

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
    const filSearch =
      search !== ""
        ? estera.filter((i) => {
            if (i.Nota.includes(search)) {
              return -1;
            }
            return 0;
          })
        : estera;

    const filterNotaByDate: IProsEster[] = [];

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

    return filterNotaByDate;
  }, [date, dateB, estera, search]);

  return (
    <Box flex={1} bg="#454545">
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
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <ContentNotas>
          <Text ml={10} color="#fff" bold fontSize={14}>
            Notas com os encarregados
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards color="#fff" nota={i} situation={i.situation} />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          <Text ml={10} color="#fff" bold fontSize={14}>
            Notas com os encarregados
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards color="#fff" nota={i} situation={i.situation} />
            )}
          />
        </ContentNotas>

        <ContentNotas>
          <Text ml={10} color="#fff" bold fontSize={14}>
            Notas com os encarregados
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            data={notas}
            keyExtractor={(h) => h.id}
            renderItem={({ item: i }) => (
              <Cards color="#fff" nota={i} situation={i.situation} />
            )}
          />
        </ContentNotas>
      </ScrollView>
    </Box>
  );
}
