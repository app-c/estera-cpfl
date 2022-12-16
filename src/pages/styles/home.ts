import styled from "styled-components/native";
import { theme } from "../../global/theme";

export const Container = styled.View``;

export const ContentData = styled.View`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px 10px;
`;

export const TouchData = styled.TouchableOpacity`
  background-color: ${theme.colors.blue[50]};
  padding: 3px 10px;
  border-radius: 5px;
`;

export const ContentNotas = styled.View`
  margin-top: 30px;
`;

export const Flat = styled.FlatList``;
