import React, { useContext } from "react";
import { Box, FlatList, Text, Modal, Button } from "native-base";
import { useRoute } from "@react-navigation/native";
import { eachDayOfInterval, format } from "date-fns";
import { NotasContext } from "../../context/ListNotas";
import { Card } from "../../components/CardNota";
import { IPropsEquipe, IProsEster } from "../../dtos";
import { InfoEquipe } from "../../components/InfoEquipe";

interface PropsParams {
  date: Date;
  dateB: Date;
}

export function Parcial() {
  const { ntReprogramada } = useContext(NotasContext);
  const { params } = useRoute();
  const { date, dateB } = params as PropsParams;

  const [selectEquipe, setSelectEquipe] = React.useState<IPropsEquipe[]>([]);
  const [info, setInfo] = React.useState("");

  const [showModalTruck, setShowModalTruck] = React.useState(false);
  const [showModalInfo, setShowModalInfo] = React.useState(false);

  console.log(date, dateB);

  const notas = React.useMemo(() => {
    const filterWihDate = [];
    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        ntReprogramada.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            filterWihDate.push(item);
          }
        });
      });
    }

    const nt = filterWihDate.map((h: IProsEster) => {
      const valor = Number(h.MO).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      });

      return {
        data: h.Dt_programação,
        valor,
        supervisor: h.SUPERVISOR,
        equipe: h.EQUIPE,
        situation: h.situation,
        obs: h.OBSERVACAO,
        nota: h.Nota,
      };
    });

    return nt;
  }, [date, dateB, ntReprogramada]);

  console.log(notas.length);

  const opemModalTruck = React.useCallback((item: IPropsEquipe[]) => {
    setSelectEquipe(item);
    setShowModalTruck(true);
  }, []);

  const openModalInfo = React.useCallback((info: string) => {
    setInfo(info);
    setShowModalInfo(true);
  }, []);

  return (
    <Box p="5">
      <Modal isOpen={showModalTruck} onClose={() => setShowModalTruck(false)}>
        <InfoEquipe
          closedModal={() => setShowModalTruck(false)}
          equipe={selectEquipe}
        />
      </Modal>

      <Modal isOpen={showModalInfo}>
        <Box p="10" bg="blue.100">
          <Button onPress={() => setShowModalInfo(false)}>fechar</Button>
          <Text>{!info ? "sem observações" : info}</Text>
        </Box>
      </Modal>
      <FlatList
        data={notas}
        renderItem={({ item: h }) => (
          <Card
            nome={h.supervisor}
            nota={Number(h.nota)}
            data={h.data}
            presObs={() => openModalInfo(h.obs)}
            presTruck={() => opemModalTruck(h.equipe)}
            valor={h.valor}
          />
        )}
      />
    </Box>
  );
}
