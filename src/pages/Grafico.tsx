/* eslint-disable prettier/prettier */
/* eslint-disable no-return-assign */
/* eslint-disable camelcase */
import React, { useState } from "react";
import { Box, Center, HStack, Input, Text } from "native-base";
import { VictoryPie } from "victory-native";
import fire from "@react-native-firebase/firestore";
import DateTimePicker from '@react-native-community/datetimepicker'
import { Dimensions, Platform, TouchableOpacity } from "react-native";
import { eachDayOfInterval, format } from "date-fns";
import { IProsEster } from "../dtos";
import { useAuth } from "../hooks/AuthContext";
import { Resumo } from "../components/Resumo";
import { categoria } from "../utilis/categoria";

interface PropsPip {
  nota: string
  total: number
  totalFormated: string
  situation: string
  color: string
  percent: string
}

export function Grafico() {
  const { user } = useAuth();
  const w = Dimensions.get("window").width
  const [notas, setNotas] = React.useState<IProsEster[]>([]);
  const [search, setSearch] = React.useState('')

  const [data, setData] = React.useState<PropsPip[]>([])

  const [mode, setMode] = useState('date');
  const [modeB, setModeB] = useState('date');
  const [show, setShow] = useState(false);
  const [showB, setShowB] = useState(false);
  const [date, setDate] = React.useState(new Date())
  const [dateB, setDateB] = React.useState(new Date())

  React.useEffect(() => {
    fire()
      .collection("notas")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IProsEster;
        });

        setNotas(res);
      });
  }, []);

  const nt = React.useMemo(() => {
    const res = notas.map((h) => {
      const tl = Number(h.MO) ;


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
    .filter(h => {
      if(user.type === 'supervisor' && user.nome === h.SUPERVISOR) {
        return h
      }

      if(user.type === 'adm' || user.type === 'dev') {
        return h
      }
    })

    const filterWihDate = []


    if(date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB
      })
  
  
      ruslt.forEach(dt => {
        const fomatDt = format(dt, 'dd/MM/yyyy')
        res.forEach(item => {
          if(fomatDt === item.Dt_programação) {
            filterWihDate.push(item)
          }
        })
      })

    } 

    const nota = filterWihDate.length > 0 ? filterWihDate : res 

    // const pr = Number(h.MO) * h.PORCENTUAL;
    // const total = pr.toLocaleString("pt-BR", {
    //   style: "currency",
    //   currency: "BRL",
    // });

    const notaTotal = nota.reduce((ac: number, h) => {
      return ac += Number(h.MO)
    }, 0)



    const subTotal: PropsPip[] = []

    categoria.forEach(cat => {
      let notaN = ''
      let sum = 0
      nota.forEach((item: IProsEster) => {
        if(cat.name === item.situation) {
          const porcent = item.PORCENTUAL || 0
          sum += (Number(item.MO) - (item.MO * porcent))
          notaN = item.Nota
        }

      })

     const totalF = sum.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });

        const prc = (sum / notaTotal * 100).toFixed(0)

        const percent = `${prc}%`

          subTotal.push({
            nota: notaN,
            total: sum,
            totalFormated: totalF,
            situation: cat.name,
            color: cat.color,
            percent
          })

    })

    return subTotal

  }, [notas, user, date, dateB]);

  // !! ///////////////////////////////////////////////////////////////////
  const onChange = React.useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
  }, [])

  const showMode = React.useCallback((currentMode) => {
    if (Platform.OS === 'android') {
      setShow(true);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  }, [])

  const showDatepicker = React.useCallback(() => {
    console.log('ok')
    showMode('date')
  }, [showMode])

  
  const onChangeB = React.useCallback((event, selectedDate) => {
    const currentDate = selectedDate;
    setShowB(false);
    setDateB(currentDate);
  }, [])
  
  const showModeB = React.useCallback((currentMode) => {
    if (Platform.OS === 'android') {
      setShowB(true);
      // for iOS, add a button that closes the picker
    }
    setModeB(currentMode);
  }, [])
  
  const showDatepickerB = React.useCallback(() => {
    console.log('ok')
    showModeB('date')
  }, [showModeB])

  return (
    <Box p='5' bg='dark.100' >

      <HStack mb='10' mt='5' space={10} >
        <TouchableOpacity onPress={showDatepicker} >
          <Box bg='dark.400' p='2' borderRadius='4' >
            <Text color='#fff' bold fontSize={16} > do dia: {format(date, 'dd/MM/yy')}</Text>
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={showDatepickerB} >
          <Box bg='dark.400' p='2' borderRadius='4' >
            <Text color='#fff' bold fontSize={16} > ao dia: {format(dateB, 'dd/MM/yy')}</Text>
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

      {nt.map(h => (
        <Resumo total={h.totalFormated} situation={h.situation} color={h.color} />
      ))}

      <Center mt='10' >

        <VictoryPie
          colorScale={categoria.map(h => h.color)}
          data={nt}
          x='percent'
          y='total'
        />
      </Center>

    </Box>
  );
}
