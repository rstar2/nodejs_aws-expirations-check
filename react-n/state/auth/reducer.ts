import { useReducer } from "react";

import { AuthState } from "../../types";

const initState: AuthState = {
	isLoading: true,
	isSignout: false,
	authToken: undefined,
};

export type AuthAction = {
	type: "RESTORE_TOKEN" | "SIGN_IN" | "SIGN_OUT";
	token?: string;
};

export const useAuthReducer = () => {
	return useReducer((prevState: AuthState, action: AuthAction): AuthState => {
		switch (action.type) {
			case "RESTORE_TOKEN":
				return {
					...prevState,
					authToken: action.token,
					isLoading: false,
					isSignout: false,
				};
			case "SIGN_IN":
				return {
					...prevState,
					isSignout: false,
					isLoading: false,
					authToken: action.token,
				};
			case "SIGN_OUT":
				return {
					...prevState,
					isSignout: true,
					isLoading: false,
					authToken: undefined,
				};
		}
	}, initState);
};
