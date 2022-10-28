/* eslint-disable react/require-default-props */
/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { Box, Input, Text, IInputProps } from "native-base";
import { Dimensions } from "react-native";

interface Props extends IInputProps {
  holder?: string;
}
export function TextInput({ ...rest }: Props) {
  const w = Dimensions.get("window").width;
  return (
    <Box w={w * 0.7}>
      <Input {...rest} placeholderTextColor="dark.300" />
    </Box>
  );
}
