import React from "react";
import { Box, Center, HStack, Image, Text } from "native-base";
import { Dimensions, TouchableOpacity } from "react-native";
import { AntDesign } from "expo-vector-icons";
import ico from "../assets/ico.png";
import { useAuth } from "../hooks/AuthContext";

export function Header() {
  const { signOut, user } = useAuth();
  const w = Dimensions.get("window").height / 2;
  return (
    <Box h={w * 0.16} bg="white.50">
      <Box px="5">
        <HStack
          w={w * 0.85}
          mt={-5}
          alignItems="center"
          justifyContent="space-between"
        >
          <Image source={ico} size={106} resizeMode="contain" alt="ico" />
          <Text bold fontSize={16}>
            {user.nome}
          </Text>

          <TouchableOpacity onPress={() => signOut()}>
            <AntDesign name="poweroff" size={30} />
          </TouchableOpacity>
        </HStack>
      </Box>
    </Box>
  );
}
