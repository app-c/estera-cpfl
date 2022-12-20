import { Button, Center, Text } from "native-base";
import React from "react";
import { TextInput } from "../components/TextInput";
import { useAuth } from "../hooks/AuthContext";

export function SignIn() {
  const { signIn } = useAuth();

  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  const submit = React.useCallback(() => {
    signIn({
      email,
      senha,
    }).catch((h) => console.log(h));
  }, [email, senha, signIn]);
  return (
    <Center>
      <Text>Entre com sua conta</Text>
      <TextInput
        keyboardType="email-address"
        onChangeText={setEmail}
        mt="10"
        placeholder="email"
      />
      <TextInput onChangeText={setSenha} mt="5" placeholder="senha" />

      <Button onPress={submit} mt="5">
        ENTRAR
      </Button>
    </Center>
  );
}
