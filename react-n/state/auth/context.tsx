import React, { useMemo, useContext } from "react";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

import { useAuthReducer, AuthAction } from "./reducer";
import {
	AuthContextValue,
	SignInData,
	SignUpData,
	AuthState,
} from "../../types";

const AuthContext = React.createContext<AuthContextValue | undefined>(
	undefined
);

export const AuthTokenName = "authToken";

function createAuthContextValue(
	state: AuthState,
	dispatch: React.Dispatch<AuthAction>
): AuthContextValue {
	return {
		state,
		signIn: async (data: SignInData) => {
			// TODO:
			// In a production app, we need to send some data (usually username, password) to server and get a token
			// We will also need to handle errors if sign in failed
			// After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
			const token = "dummy-auth-token";

			if (Platform.OS !== "web")
				await SecureStore.setItemAsync(AuthTokenName, token);

			dispatch({ type: "SIGN_IN", token });
		},
		signUp: async (data: SignUpData) => {
			// TODO:
			// In a production app, we need to send user data to server and get a token
			// We will also need to handle errors if sign up failed
			// After getting token, we need to persist the token using `SecureStore` or any other encrypted storage

			const token = "dummy-auth-token";

			if (Platform.OS !== "web")
				await SecureStore.setItemAsync(AuthTokenName, token);

			dispatch({ type: "SIGN_IN", token });
		},
		signOut() {
			// keep it async no need to wait for it, technically it could fail
			// but it doesn't matter
			SecureStore.deleteItemAsync(AuthTokenName);

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

	// NOTE: you *might* need to memoize this value
	// Learn more in http://kcd.im/optimize-context
	const context = useMemo<AuthContextValue>(
		() => createAuthContextValue(state, dispatch),
		[state, dispatch]
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
