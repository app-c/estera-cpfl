import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  CheckIcon,
  FormControl,
  Select,
  Text,
  WarningOutlineIcon,
} from "native-base";
import { Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import fire from "@react-native-firebase/firestore";
import { Feather } from "expo-vector-icons";
import { IPropsEquipe, IProsEster, IProsFuncionarios } from "../dtos";
import { IUser } from "../hooks/AuthContext";
import { NotasContext } from "../context/ListNotas";
import { theme } from "../global/theme";

interface Props {
  selectEquipe: IPropsEquipe[];
  openModalEquipe: () => void;
  closed: () => void;
  updateEquipe: () => void;
  setSupervisor: (item: string) => void;
  supervisor: string;
}

export function ModalAlteraEquiSuper({
  selectEquipe,
  openModalEquipe,
  closed,
  updateEquipe,
  setSupervisor,
  supervisor,
}: Props) {
  const { equipes } = useContext(NotasContext);
  const w = Dimensions.get("window").width;

  const [loading, setLoading] = useState(false);

  // const [supervisor, setSupervisor] = useState(data.SUPERVISOR);
  const [users, setUsers] = React.useState<IUser[]>([]);
  const [equipe, setEquipe] = useState<IProsFuncionarios[]>([]);

  React.useEffect(() => {
    fire()
      .collection("user")
      .get()
      .then((h) => {
        const rs = h.docs.map((p) => p.data());

        const fil = rs.filter((p) => p.type === "supervisor");
        setUsers(fil);
      });

    fire()
      .collection("notas")
      .onSnapshot((h) => {
        const rs = h.docs.map((p) => {
          return p.data() as IProsEster;
        });

        const eq = rs.map((p) => {
          return p.EQUIPE;
        });

        setEquipe(eq);
      });
  }, []);

  return (
    <>
      <Box
        alignSelf="center"
        top={w * 0.6}
        bg="dark.300"
        p="5"
        w={w * 0.8}
        borderRadius="10"
      >
        <TouchableOpacity onPress={closed}>
          <Box alignItems="flex-end" p="3">
            <Feather
              name="x-circle"
              color={theme.colors.orange[10]}
              size={28}
            />
          </Box>
        </TouchableOpacity>
        <FormControl w="100%">
          <FormControl.Label _text={{ color: "dark.900" }}>
            Escolha um supervisor
          </FormControl.Label>
          <Select
            minWidth="200"
            selectedValue={supervisor}
            onValueChange={(h) => setSupervisor(h)}
            accessibilityLabel="Choose Service"
            placeholder="Choose Service"
            color="dark.900"
            _selectedItem={{
              bg: "teal.600",
              endIcon: <CheckIcon size={5} />,
            }}
            mt="1"
          >
            {users.map((h) => (
              <Select.Item key={h.nome} label={h.nome} value={h.nome} />
            ))}
          </Select>
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            Please make a selection!
          </FormControl.ErrorMessage>
        </FormControl>

        <TouchableOpacity onPress={openModalEquipe}>
          <Box mt="5" p="3" borderWidth={1} borderColor="white.50">
            <Text color="white.50" bold>
              Selecione a equipe
            </Text>
            {selectEquipe.map((h) => (
              <Box key={h.equipe}>
                <Text color="white.50" bold>
                  {h.equipe}
                </Text>
              </Box>
            ))}
          </Box>
        </TouchableOpacity>

        <Button onPress={updateEquipe} mt="10">
          {loading ? <ActivityIndicator /> : <Text>FINALIZAR</Text>}
        </Button>
      </Box>
    </>
  );
}
