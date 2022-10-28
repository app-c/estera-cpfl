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
  const { estera } = useContext(NotasContext);
  const { params } = useRoute();
  const { date, dateB } = params as PropsParams;

  const [selectEquipe, setSelectEquipe] = React.useState<IPropsEquipe[]>([]);
  const [info, setInfo] = React.useState("");

  const [showModalTruck, setShowModalTruck] = React.useState(false);
  const [showModalInfo, setShowModalInfo] = React.useState(false);

  const notas = React.useMemo(() => {
    const filterWihDate = [];
    if (date.getTime() <= dateB.getTime()) {
      const ruslt = eachDayOfInterval({
        start: date,
        end: dateB,
      });

      ruslt.forEach((dt) => {
        const fomatDt = format(dt, "dd/MM/yyyy");
        estera.forEach((item) => {
          if (fomatDt === item.Dt_programação) {
            filterWihDate.push(item);
          }
        });
      });
    }

    const nt = filterWihDate
      .map((h: IProsEster) => {
        return {
          data: h.Dt_programação,
          valor: h.MO,
          supervisor: h.SUPERVISOR,
          equipe: h.EQUIPE,
          situation: h.situation,
          obs: h.OBSERVACAO,
        };
      })
      .filter((h) => h.situation === "parcial");

    return nt;
  }, [date, dateB, estera]);

  const opemModalTruck = React.useCallback((item: IPropsEquipe[]) => {
    setSelectEquipe(item);
    setShowModalTruck(true);
  }, []);

  const openModalInfo = React.useCallback((info: string) => {
    setInfo(info);
    setShowModalInfo(true);
  }, []);

  console.log(info);

  return (
    <Box p="5">
      <Modal isOpen={showModalTruck} onClose={() => setShowModalTruck(false)}>
        <InfoEquipe equipe={selectEquipe} />
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
            nota={h.valor}
            presObs={() => openModalInfo(h.obs)}
            presTruck={() => opemModalTruck(h.equipe)}
          />
        )}
      />
    </Box>
  );
}
