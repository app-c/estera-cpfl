import styled from "styled-components/native";

export const Container = styled.View`
  background-color: #454545;

  flex: 1;
`;

export const BoxContainer = styled.View`
  padding: 20px;
`;

export const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;

export const ObsText = styled.Text`
  margin-top: 20px;
  margin-left: 20px;

  font-size: 14px;
  color: #fff;
`;

export const BoxVeiculos = styled.View`
  flex-direction: row;

  background-color: #9b9b9b;

  height: 80px;
  border-radius: 8px;
  margin-top: 10px;
  padding: 5px;

  align-items: center;
  justify-content: space-between;
`;

export const BoxInfoAd = styled.View`
  background-color: #9b9b9b;

  border-radius: 8px;
  margin-top: 10px;
  padding: 5px;
`;

export const BoxButton = styled.TouchableOpacity`
  align-self: center;
  align-items: center;

  margin-top: 20px;
  background-color: #d87736;
  width: 100%;
  padding: 10px 20px;
  border-radius: 8px;
`;
