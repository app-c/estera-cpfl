import { Box } from "native-base";
import React from "react";
import { useAuth } from "../hooks/AuthContext";
import { SignIn } from "../pages/SignIn";
import { AuthRoutes } from "./AuthRoutes";
import { GestaoRoutes } from "./GestaoRoutes";

export function Route() {
  const { user } = useAuth();

  return (
    <Box flex="1">
      {user ? (
        <>{user.type === "gestor" ? <GestaoRoutes /> : <AuthRoutes />}</>
      ) : (
        <SignIn />
      )}
    </Box>
  );
}
