import styled from "styled-components/native";

interface PropsContainer {
  color: string;
}

type ColorSituation = "finish" | "partial" | "canceled";

interface ColorPropsButton {
  color: ColorSituation;
}

const situation = {
  finish: "#37742f",
  partial: "#8a8a39",
  canceled: "#7d362d",
};

export const BoxContainer = styled.TouchableOpacity``;

export const BoxButton = styled.TouchableOpacity<ColorPropsButton>`
  background-color: ${({ color: h }) => situation[h]};
  /* width: 70px; */
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  padding: 4px 5px;
`;

export const TextButon = styled.Text`
  color: #fff;
  font-size: 14px;
`;

export const Container = styled.View<PropsContainer>`
  width: 250px;
  margin-left: 15px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${({ color: h }) => h};
`;

export const Content = styled.View`
  padding: 8px 10px;
  width: 100%;
`;

export const BoxEquipe = styled.View`
  flex-direction: row;
  width: 100px;
`;

export const ContentButton = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  width: 100%;
`;
