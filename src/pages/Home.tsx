/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import React, { useCallback, useContext, useState } from "react";
import {
  Box,
  Button,
  Center,
  FlatList,
  HStack,
  Input,
  ScrollView,
  Text,
} from "native-base";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  TouchableOpacity,
} from "react-native";
import fire from "@react-native-firebase/firestore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { eachDayOfInterval } from "date-fns/esm";
import { CardTotal } from "../components/cardTotal";
import { Cards } from "../components/cards";
import { ModalD } from "../components/ModalD";
import { IUser, useAuth } from "../hooks/AuthContext";
import { notas as es } from "../utilis/estera";
import { IPropsEquipe, IProsEster } from "../dtos";
import { FUNCIONARIOS } from "../utilis/funcionarios";
import { NotasContext, NotasProvider } from "../context/ListNotas";
import { theme } from "../global/theme";
import { ModalAlteraEquiSuper } from "../components/ModalAlteraEqSuper";
import { Header } from "../components/header";

export function Home() {
  const { colors } = theme;
  const { estera, GDS, ntCancelada, ntReprogramada } = useContext(NotasContext);
  const { user, signOut } = useAuth();

  const w = Dimensions.get("window").width / 2;

  const [info, setInfo] = React.useState({} as IProsEster);
  //* * MODAL ...............................................

  // todo MODAL INFO......
  const [showModalId, setShowModalId] = React.useState(false);
  const handleShowModal = React.useCallback((data: IProsEster) => {
    setInfo(data);
    setShowModalId(true);
  }, []);

  const closedModal = React.useCallback(() => {
    setShowModalId(false);
  }, []);

  // TODO MODAL UPDATE EQUIPE E SUPERVISOR
  const [showModalUpdateEquipe, setShowModalUpdateEquipe] =
    React.useState(false);

  const [supervisor, setSupervisor] = React.useState("Supervisor");

  const handleShowModaUpdateEquipe = React.useCallback(() => {
    setShowModalUpdateEquipe(true);
  }, []);

  // TODO MODAL EQUIPE
  const [showModalEquipe, setShowModalEquipe] = React.useState(false);
  const [selectEquipe, setSelectEquipe] = React.useState<IPropsEquipe[]>([]);

  const submitUpdateEstera = useCallback(() => {
    fire()
      .collection("notas")
      .doc(info.id)
      .update({
        SUPERVISOR: supervisor,
        EQUIPE: selectEquipe.length > 0 ? selectEquipe : info.EQUIPE,
      })
      .then(() => {
        Alert.alert("Nota atualizada");
      })
      .catch((h) => console.log(h))
      .finally(() => {
        setSelectEquipe([]);
        setShowModalUpdateEquipe(false);
      });
  }, [info, selectEquipe, supervisor]);

  const submitSelectEquipe = React.useCallback(
    (equipe: IPropsEquipe) => {
      setSelectEquipe([...selectEquipe, equipe]);
      setShowModalEquipe(false);
    },
    [selectEquipe]
  );

  const handleOpenModaEquipe = React.useCallback(() => {
    setShowModalEquipe(true);
  }, []);

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

  // React.useEffect(() => {
  //   fire()
  //     .collection("notas")
  //     .get()
  //     .then((h) => {
  //       const rs = h.docs.map((p) => p.data() as IProsEster);

  //       rs.forEach((r) => {
  //         const dt = {
  //           ...r,
  //           obs_past: "",
  //         };
  //         fire()
  //           .collection("notas")
  //           .doc(r.id)
  //           .update(dt)
  //           .then((h) => console.log("ok"));
  //       });
  //     });
  // }, []);

  // TODO NOTAS
  const nt = React.useMemo(() => {
    const res = estera
      .map((h) => {
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
      })
      .filter((h) => {
        if (user.type === "supervisor" && user.nome === h.SUPERVISOR) {
          return h;
        }

        if (user.type !== "supervisor") {
          return h;
        }
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

    const nota = filterWihDate.length > 0 ? filterWihDate : [];
    const notaCompare = [];

    ntReprogramada.forEach((h) => {
      nota.forEach((p: IProsEster) => {
        if (p.Nota === h.Nota) {
          const dados = {
            ...h,
            TLE: p.TLE,
            MO: p.MO,
            obs_past: h.OBSERVACAO,
            Dt_programação: p.Dt_programação,
            ntParcial: true,
          };

          fire()
            .collection("notas")
            .doc(p.id)
            .update(dados)
            .then((h) => console.log("ok"));

          fire()
            .collection("nt-parcial")
            .doc(h.id)
            .delete()
            .then(() => console.log("nota deletada da parcial"));
        }
      });
    });

    ntCancelada.forEach((h) => {
      nota.forEach((p: IProsEster) => {
        if (p.Nota === h.Nota) {
          const dados = {
            ...h,
            TLE: p.TLE,
            obs_past: h.OBSERVACAO,
            MO: p.MO,
            Dt_programação: p.Dt_programação,
            ntParcial: true,
          };

          fire()
            .collection("notas")
            .doc(p.id)
            .update(dados)
            .then((h) => console.log("ok"));

          fire()
            .collection("nt-cancelada")
            .doc(h.id)
            .delete()
            .then(() => console.log("nota deletada da parcial"));
        }
      });
    });

    const notaFilter =
      search !== ""
        ? nota.filter((h) => {
            if (h.Nota.includes(search)) {
              return h;
            }
          })
        : nota;

    const nt_estera = notaFilter.filter(
      (h) =>
        h.situation === "estera" ||
        h.situation === "nt_parcial" ||
        h.situation === "nt_cancelada"
    );
    const nt_proc = notaFilter.filter((h) => h.situation === "processo");
    const nt_executada = notaFilter.filter((h) => h.situation === "executada");
    const nt_cancelada = notaFilter.filter((h) => h.situation === "cancelada");

    const nt_parcial = notaFilter
      .filter((h) => h.situation === "parcial")
      .map((h) => {
        const pr = Number(h.MO) * h.PORCENTUAL;
        const total = pr.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return {
          ...h,
          MO: pr,
          price: total,
        };
      });

    return {
      estera: nt_estera,
      proc: nt_proc,
      exec: nt_executada,
      parcial: nt_parcial,
      cancelada: nt_cancelada,
    };
  }, [estera, date, dateB, search, user, ntCancelada, ntReprogramada]);

  const submit = React.useCallback(() => {
    fire()
      .collection("nota-teste")
      .get()
      .then((h) => {
        const rs = h.docs.map((p) => p.data());

        const dados = {
          Nota: 300000718043,
          Dt_programação: "08/11/2022",
          situation: "estera",
          MO: 17042,
          EQUIPE: [],
          OBSERVACAO: "",
        };

        fire().collection("notas").add(dados);
      });
  }, []);

  const total = React.useMemo(() => {
    const tl = nt.estera.reduce((ac, item) => {
      return (ac += item.MO);
    }, 0);

    const tp = nt.proc.reduce((ac, item) => {
      return (ac += item.MO);
    }, 0);

    const exe = nt.exec.reduce((ac, item) => {
      return (ac += item.MO);
    }, 0);

    const parcia = nt.parcial.reduce((ac, item) => {
      return (ac += item.MO);
    }, 0);

    const cancelad = nt.cancelada.reduce((ac, item) => {
      return (ac += item.MO);
    }, 0);

    const NtParcial = [];
    const NtCancelada = [];

    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        ntReprogramada.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            NtParcial.push(item);
          }
        });

        ntCancelada.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            NtCancelada.push(item);
          }
        });
      });
    }

    const nt_parcial = NtParcial.reduce((ac, it) => {
      return (ac += Number(it.MO));
    }, 0);

    const nt_cancelada = NtParcial.reduce((ac, it) => {
      return (ac += Number(it.MO));
    }, 0);

    const subTotal = tl + exe + tp + parcia + cancelad;

    const total = subTotal.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const exec = exe.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const parcial = parcia.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    const cancelada = cancelad.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return {
      total,
      exec,
      parcial,
      cancelada,
    };
  }, [date, dateB, nt, ntCancelada, ntReprogramada]);

  if (!nt) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <NotasProvider>
        <Header />
        <Box p="5" flex="1" bg={colors.white[50]}>
          {/* MODAL DE INFORMAÇAO DA NOTA */}
          <Modal visible={showModalId} animationType="fade">
            <ModalD
              closedModal={closedModal}
              estera={info}
              openUpdateEquipe={handleShowModaUpdateEquipe}
              sendSupervisor={() => {}}
              updateEquipe={() => {}}
              situation={info.situation}
            />
          </Modal>

          {/* MODAL DE ATUALIZAR EQUIPE E SUPERVISOR */}
          <Modal transparent visible={showModalUpdateEquipe}>
            <ModalAlteraEquiSuper
              pres={() => {}}
              data={info}
              closed={() => setShowModalUpdateEquipe(false)}
              openModalEquipe={handleOpenModaEquipe}
              selectEquipe={selectEquipe}
              setSupervisor={(h) => setSupervisor(h)}
              supervisor={supervisor}
              updateEquipe={submitUpdateEstera}
            />
          </Modal>

          {/* MODA EQUIPE */}
          <Modal visible={showModalEquipe}>
            <Box p="5">
              <ScrollView>
                {GDS.map((h) => (
                  <TouchableOpacity
                    key={h.equipe}
                    onPress={() => submitSelectEquipe(h)}
                  >
                    <Center mt="3" borderRadius="5" h="10" bg="white.100">
                      <Text>{h.equipe}</Text>
                    </Center>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Box>
          </Modal>

          <Box bg="white.100" w={w * 2} alignSelf="center" mt="-5" p="5">
            {user.type === "dev" && (
              <Button mb="5" w={w * 0.3} h={w * 0.09} onPress={submit}>
                Add notas
              </Button>
            )}

            <HStack mt={-2} justifyContent="space-between">
              <TouchableOpacity onPress={showDatepicker}>
                <Box bg="blue.10" p="2" borderRadius="4">
                  <Text color="#fff" bold fontSize={16}>
                    {" "}
                    do dia: {format(date, "dd/MM/yy")}
                  </Text>
                </Box>
              </TouchableOpacity>

              <TouchableOpacity onPress={showDatepickerB}>
                <Box bg="blue.10" p="2" borderRadius="4">
                  <Text color="#fff" bold fontSize={16}>
                    {" "}
                    ao dia: {format(dateB, "dd/MM/yy")}
                  </Text>
                </Box>
              </TouchableOpacity>
            </HStack>

            <Input
              mt="1"
              w={w * 0.72}
              h={w * 0.18}
              fontSize="16"
              color="dark.10"
              placeholderTextColor="dark.10"
              borderColor="orange.10"
              keyboardType="numeric"
              placeholder="NOTA"
              onChangeText={setSearch}
              selectionColor="dark.900"
              _focus={{
                bg: "white.100",
                color: "dark.10",
              }}
            />

            <Box mt={-1}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: w * 0.1,
                }}
              >
                <CardTotal
                  title="TOTAL"
                  value={total.total}
                  color={colors.dark[50]}
                />

                <CardTotal
                  title="NT-FINALIZADA"
                  value={total.exec}
                  color={colors.green[10]}
                />

                <CardTotal
                  title="NT-PARCIAL"
                  value={total.parcial}
                  color="yellow.600"
                />
              </ScrollView>
            </Box>
          </Box>

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

          <ScrollView contentContainerStyle={{ paddingBottom: 50 }}>
            {user.type !== "supervisor" && (
              <Box mt="5">
                <HStack alignItems="center" space="4">
                  <Text color="dark.10" bold>
                    Esteira: Processos
                  </Text>
                </HStack>

                <FlatList
                  horizontal
                  data={nt.estera}
                  keyExtractor={(h) => h.Nota}
                  renderItem={({ item: h }) => (
                    <Cards
                      tle={h.TLE}
                      title={h.Nota}
                      value={h.price}
                      supervisor={h.SUPERVISOR}
                      equipe={h.EQUIPE}
                      color="dark.100"
                      showModal={() => handleShowModal(h)}
                      situation={{
                        ntParcial: h.ntParcial,
                        ntCancelada: h.ntCancelada,
                      }}
                    />
                  )}
                />
              </Box>
            )}

            {/*  NOTA EM PROCESSO */}
            <Box mt="10">
              <HStack alignItems="center" space="4">
                <Text bold fontSize={16} color="dark.10">
                  Esteira: Encarregados
                </Text>
              </HStack>
              <FlatList
                horizontal
                data={nt.proc}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <Cards
                    title={String(h.Nota)}
                    value={h.price}
                    color="blue.300"
                    supervisor={h.SUPERVISOR}
                    equipe={
                      h.EQUIPE ? h.EQUIPE : [{ equipe: "GED", dados: [] }]
                    }
                    showModal={() => handleShowModal(h)}
                    situation={{
                      ntParcial: h.ntParcial,
                      ntCancelada: h.ntCancelada,
                    }}
                  />
                )}
              />
            </Box>

            {/* NOTA FINALIZADA */}
            <Box mt="10">
              <HStack alignItems="center" space="4">
                <Text bold fontSize={16} color="dark.10">
                  Notas finalizadas
                </Text>
              </HStack>
              <FlatList
                horizontal
                data={nt.exec}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <Cards
                    title={String(h.Nota)}
                    value={h.price}
                    supervisor={h.SUPERVISOR}
                    equipe={
                      h.EQUIPE ? h.EQUIPE : [{ equipe: "GED", dados: [] }]
                    }
                    showModal={() => handleShowModal(h)}
                    color="green.400"
                    situation={{
                      ntParcial: h.ntParcial,
                      ntCancelada: h.ntCancelada,
                    }}
                  />
                )}
              />
            </Box>

            {/* NOTA PARCIAL */}
            <Box mt="10">
              <HStack alignItems="center" space="4">
                <Text bold color="dark.10">
                  Notas parciais
                </Text>
              </HStack>
              <FlatList
                horizontal
                data={nt.parcial}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <Cards
                    title={String(h.Nota)}
                    value={h.price}
                    equipe={
                      h.EQUIPE ? h.EQUIPE : [{ equipe: "GED", dados: [] }]
                    }
                    supervisor={h.SUPERVISOR}
                    color="yellow.500"
                    showModal={() => handleShowModal(h)}
                    situation={{
                      ntParcial: h.ntParcial,
                      ntCancelada: h.ntCancelada,
                    }}
                  />
                )}
              />
            </Box>

            <Box mt="10">
              <HStack alignItems="center" space="4">
                <Text bold color="dark.10">
                  Notas canceladas
                </Text>
              </HStack>
              <FlatList
                horizontal
                data={nt.cancelada}
                keyExtractor={(h) => h.id}
                renderItem={({ item: h }) => (
                  <Cards
                    title={h.Nota}
                    value={h.price}
                    equipe={h.EQUIPE}
                    supervisor={h.SUPERVISOR}
                    showModal={() => handleShowModal(h)}
                    color="red.400"
                    situation={{
                      ntParcial: h.ntParcial,
                      ntCancelada: h.ntCancelada,
                    }}
                  />
                )}
              />
            </Box>
          </ScrollView>
        </Box>
      </NotasProvider>
    </>
  );
}
