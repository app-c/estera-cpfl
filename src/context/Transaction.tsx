/* eslint-disable prefer-const */
/* eslint-disable consistent-return */
/* eslint-disable array-callback-return */
/* eslint-disable camelcase */
import React, { createContext } from "react";
import fire from "@react-native-firebase/firestore";
import { eachDayOfInterval, format } from "date-fns";
import { IProsEster } from "../dtos";
import { IUser } from "../hooks/AuthContext";

interface PropsTotal {
  user: IUser;
  date: Date;
  dateB: Date;
  estera: IProsEster[];
  search: string;
}

interface ProviderProps {
  children: React.ReactNode;
}

interface PropsEtera {
  estera: IProsEster[];
  proc: IProsEster[];
  exec: IProsEster[];
  parcial: IProsEster[];
  cancelada: IProsEster[];
}

interface PropsContext {
  total: PropsEtera;
  nt(data: PropsEtera): Promise<void>;
}

export const TransactionContext = createContext({} as PropsContext);

export function TransactionProvider({ children }: ProviderProps) {
  const [total, setTotal] = React.useState<IProsEster>();

  const nt = React.useCallback(({ user, date, dateB, estera, search }) => {
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

        if (user.type === "adm" || user.type === "dev") {
          return h;
        }
      });

    let filterWihDate: IProsEster[] = [];

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

    const notaFilter = search
      ? nota.filter((h) => {
          if (h.Nota.includes(search)) {
            return h;
          }
        })
      : nota;

    const nt_estera = notaFilter.filter((h) => h.situation === "estera");
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

    const dados = {
      estera: nt_estera as IProsEster[],
      proc: nt_proc as IProsEster[],
      exec: nt_executada as IProsEster[],
      parcial: nt_parcial as IProsEster[],
      cancelada: nt_cancelada as IProsEster[],
    };

    setTotal(dados);
  }, []);

  return (
    <TransactionContext.Provider value={{ nt, total }}>
      {children}
    </TransactionContext.Provider>
  );
}
