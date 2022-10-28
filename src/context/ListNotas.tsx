/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
import React, { createContext } from "react";
import fire from "@react-native-firebase/firestore";
import { IC4, IProsEster, IProsFuncionarios } from "../dtos";

interface ProviderProps {
  children: React.ReactNode;
}

interface PropsContext {
  estera: IProsEster[];
  equipes: IProsFuncionarios[];
  GDS: IProsFuncionarios[];
  ntReprogramada: IProsEster[];
  ntCancelada: IProsEster[];
  c4: IC4[];
  emergencia: IC4[];
}

export const NotasContext = createContext({} as PropsContext);

export function NotasProvider({ children }: ProviderProps) {
  const [estera, setEstera] = React.useState<IProsEster[]>([]);
  const [equipes, setEquipes] = React.useState<IProsFuncionarios[]>([]);
  const [ntReprogramada, setNtReprogramada] = React.useState<IProsEster[]>([]);
  const [ntCancelada, setNtCancelada] = React.useState<IProsEster[]>([]);
  const [c4, setC4] = React.useState<IC4[]>([]);
  const [emergencia, setEmergencia] = React.useState<IC4[]>([]);

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

        setEstera(res);
      });

    fire()
      .collection("c4")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IC4;
        });

        setC4(res);
      });

    fire()
      .collection("emergencia")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IC4;
        });

        setEmergencia(res);
      });

    fire()
      .collection("equipes")
      .onSnapshot((p) => {
        const rs = p.docs.map((h) => {
          return {
            ...h.data(),
            id: h.id,
          } as IProsFuncionarios;
        });
        setEquipes(rs);
      });

    fire()
      .collection("notas")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IProsEster;
        });

        setEstera(res);
      });

    fire()
      .collection("nt-parcial")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IProsEster;
        });

        setNtReprogramada(res);
      });

    fire()
      .collection("nt-cancelada")
      .onSnapshot((h) => {
        const res = h.docs.map((p) => {
          return {
            ...p.data(),
            id: p.id,
          } as IProsEster;
        });

        setNtCancelada(res);
      });
  }, []);

  const GDS = React.useMemo(() => {
    const ADM = [];
    const ALMOXARIFADO = [];
    const GD_17 = [];
    const GD_18 = [];
    const GD_19 = [];
    const GD_20 = [];
    const GD_21 = [];
    const GD_22 = [];
    const GD_23 = [];
    const GD_24 = [];
    const GD_25 = [];
    const GD_26 = [];
    const GD_27 = [];
    const GD_28 = [];
    const GD_29 = [];
    const GD_40 = [];
    const LM_01 = [];
    const LM_02 = [];
    const LM_03 = [];
    const LM_04 = [];
    const LV_30 = [];
    const LV_31 = [];
    const LV_32 = [];
    const LV_33 = [];
    const MONTADOR = [];
    const RESERVA = [];
    const VIABILIDADE = [];
    const equipe = equipes.sort((a, b) => {
      if (b.equipe > a.equipe) {
        return -1;
      }
    });

    equipe.forEach((h) => {
      if (h.equipe === "ADM") {
        ADM.push(h);
      }
      if (h.equipe === "ALMOXARIFADO") {
        ALMOXARIFADO.push(h);
      }
      if (h.equipe === "GD-17") {
        GD_17.push(h);
      }
      if (h.equipe === "GD-18") {
        GD_18.push(h);
      }
      if (h.equipe === "GD-19") {
        GD_19.push(h);
      }
      if (h.equipe === "GD-20") {
        GD_20.push(h);
      }
      if (h.equipe === "GD-21") {
        GD_21.push(h);
      }
      if (h.equipe === "GD-22") {
        GD_22.push(h);
      }
      if (h.equipe === "GD-23") {
        GD_23.push(h);
      }
      if (h.equipe === "GD-24") {
        GD_24.push(h);
      }
      if (h.equipe === "GD-25") {
        GD_25.push(h);
      }
      if (h.equipe === "GD-26") {
        GD_26.push(h);
      }
      if (h.equipe === "GD-27") {
        GD_27.push(h);
      }
      if (h.equipe === "GD-28") {
        GD_28.push(h);
      }
      if (h.equipe === "GD-29") {
        GD_29.push(h);
      }
      if (h.equipe === "GD-40") {
        GD_40.push(h);
      }
      if (h.equipe === "LM-01") {
        LM_01.push(h);
      }
      if (h.equipe === "LM-02") {
        LM_02.push(h);
      }
      if (h.equipe === "LM-03") {
        LM_03.push(h);
      }
      if (h.equipe === "LM-04") {
        LM_04.push(h);
      }
      if (h.equipe === "LV-30") {
        LV_30.push(h);
      }
      if (h.equipe === "LV-31") {
        LV_31.push(h);
      }
      if (h.equipe === "LV-32") {
        LV_32.push(h);
      }
      if (h.equipe === "LV-33") {
        LV_33.push(h);
      }
      if (h.equipe === "MONTADOR") {
        MONTADOR.push(h);
      }
      if (h.equipe === "RESERVA") {
        RESERVA.push(h);
      }
      if (h.equipe === "VIABILIDADE") {
        VIABILIDADE.push(h);
      }
    });

    const dados = [
      { id: "1", equipe: "ALMOXARIFADO", dados: ALMOXARIFADO },
      { id: "2", equipe: "ALMOXARIFADO", dados: ALMOXARIFADO },
      { id: "3", equipe: "GD-17", dados: GD_17 },
      { id: "4", equipe: "GD-18", dados: GD_18 },
      { id: "5", equipe: "GD-19", dados: GD_19 },
      { id: "6", equipe: "GD-20", dados: GD_20 },
      { id: "7", equipe: "GD-21", dados: GD_21 },
      { id: "8", equipe: "GD-22", dados: GD_22 },
      { id: "9", equipe: "GD-23", dados: GD_23 },
      { id: "0", equipe: "GD-24", dados: GD_24 },
      { id: "10", equipe: "GD-25", dados: GD_25 },
      { id: "11", equipe: "GD-26", dados: GD_26 },
      { id: "12", equipe: "GD-27", dados: GD_27 },
      { id: "13", equipe: "GD-28", dados: GD_28 },
      { id: "14", equipe: "GD-29", dados: GD_29 },
      { id: "15", equipe: "GD-40", dados: GD_40 },
      { id: "16", equipe: "LM-01", dados: LM_01 },
      { id: "17", equipe: "LM-02", dados: LM_02 },
      { id: "18", equipe: "LM-03", dados: LM_03 },
      { id: "19", equipe: "LM-04", dados: LM_04 },
      { id: "20", equipe: "LV-30", dados: LV_30 },
      { id: "21", equipe: "LV-31", dados: LV_31 },
      { id: "22", equipe: "LV-32", dados: LV_32 },
      { id: "23", equipe: "LV-33", dados: LV_33 },
      { id: "24", equipe: "MONTADOR", dados: MONTADOR },
      { id: "25", equipe: "RESERVA", dados: RESERVA },
      { id: "26", equipe: "VIABILIDADE", dados: VIABILIDADE },
    ];

    const gds = [];

    dados.forEach((h) => {
      const eq = h.dados.find((p) => p.equipe === h.equipe);
      const dt = {
        id: eq ? eq.id : "0",
        equipe: h.equipe,
        mobilidade: eq ? eq.MOBILIDADE : false,
        dados: h.dados,
      };
      gds.push(dt);
    });

    return gds;
  }, [equipes]);

  return (
    <NotasContext.Provider
      value={{
        estera,
        equipes,
        GDS,
        ntCancelada,
        ntReprogramada,
        c4,
        emergencia,
      }}
    >
      {children}
    </NotasContext.Provider>
  );
}
