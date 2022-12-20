import { IProsEster } from "../dtos";

/* eslint-disable camelcase */
interface PropsParcial {
  date: Date;
  dateB: Date;
}

interface IInfoNota {
  item: IProsEster;
  type?: string;
}

type IPropsTratativa = {
  id: string;
};

export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      singIn: undefined;
      grafico: undefined;
      parcial: PropsParcial;
      // executada: PropsParcial;
      infoNota: IInfoNota;
      tratativa: IInfoNota;
      executada: IInfoNota;
    }
  }
}
