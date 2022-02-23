import React, { useMemo, useContext } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import * as auth from "../../service/auth";
import { useAuthReducer, AuthAction } from "./reducer";
import {
  AuthContextValue,
  SignInData,
  SignUpData,
  AuthState,
} from "../../types";

import { useToastContext } from "../error/context";

const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export const AuthTokenName = "authToken";

function createAuthContextValue(
  state: AuthState,
  dispatch: React.Dispatch<AuthAction>,
  showError: (error: string, isLong?: boolean) => void
): AuthContextValue {
  return {
    state,
    signIn: async (data: SignInData) => {
      let token!: string;
      try {
        // We will also need to handle errors if sign in failed
        token = await auth.login(data.email, data.password);
      } catch (err) {
        console.error("Failed to sign-in", err);
		// TODO: If needed can check the concrete error-reason and show more specific error message
		showError("Failed to sign-in", true);
        
		// leave the whole method
		return;
      }

      // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      if (Platform.OS !== "web") {
        try {
          await SecureStore.setItemAsync(AuthTokenName, token);
        } catch (err) {
          console.error("Failed to store auth token", err);
        }
      }
      dispatch({ type: "SIGN_IN", token });
    },
    signUp: async (data: SignUpData) => {
      //   // TODO: implement if needed
      //   const token = await auth.register(data.email, data.password, data.name);
      //   // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
      //   if (Platform.OS !== "web")
      //     await SecureStore.setItemAsync(AuthTokenName, token);
      //   dispatch({ type: "SIGN_IN", token });
    },
    signOut() {
      // keep it async no need to wait for it, technically it could fail
      // but it doesn't matter
      if (Platform.OS !== "web") SecureStore.deleteItemAsync(AuthTokenName);

      dispatch({ type: "SIGN_OUT" });
    },
    restore(token: string) {
      dispatch({ type: "RESTORE_TOKEN", token });
    },
  };
}

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useAuthReducer();

  const toastContext = useToastContext();

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<AuthContextValue>(
    () => createAuthContextValue(state, dispatch, toastContext.show),
    [state, dispatch, toastContext.show]
  );

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  );
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within a AuthContextProvider");
  }
  return context;
}
