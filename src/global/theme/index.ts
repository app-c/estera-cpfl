/* eslint-disable @typescript-eslint/no-empty-interface */
import React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import { Content } from "./Content";

export const theme = extendTheme({
  colors: {
    // Add new color
    white: {
      50: "#ecf5f9",
      100: "#C5E4F3",
    },

    red: {
      10: "#FE252E",
      50: "#e8878a",
    },

    blue: {
      10: "#0AB1E5",
      50: "#92c4d3",
    },

    orange: {
      10: "#FF8F05",
      50: "#ffcb8c",
    },

    dark: {
      10: "#16293A",
      50: "#42474a",
    },

    green: {
      10: "#59C639",
      50: "#93bd86",
    },
  },
  config: {
    // Changing initialColorMode to 'dark'
    initialColorMode: "light",
  },
});

type CustomThemeType = typeof theme;

// 3. Extend the internal NativeBase Theme
declare module "native-base" {
  interface ICustomTheme extends CustomThemeType {}
}

//   return (
//     <NativeBaseProvider theme={theme}>
//       <Content />
//     </NativeBaseProvider>
//   );
// }
