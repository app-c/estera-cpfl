/* eslint-disable camelcase */
interface PropsParcial {
  date: Date;
  dateB: Date;
}
export declare global {
  namespace ReactNavigation {
    interface RootParamList {
      home: undefined;
      singIn: undefined;
      grafico: undefined;
      parcial: PropsParcial;
      executada: PropsParcial;
    }
  }
}
