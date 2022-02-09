import { useReducer } from "react";

import { AuthState } from "../../types";

const initState: AuthState = {
  isLoading: true,
  isSignout: false,
  authToken: undefined,
};
const reducer = (prevState: AuthState, action: AuthAction): AuthState => {
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
};

export type AuthAction = {
  type: "RESTORE_TOKEN" | "SIGN_IN" | "SIGN_OUT";
  token?: string;
};

export const useAuthReducer = () => {
  // NOTE: the reducer function has to be defined not as inline function here are it will mean it will
  // be each time a new function, so a dispatch(...) could cause calling the reducer twice
  // More info at:
  // https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice
  // https://stackoverflow.com/questions/55055793/react-usereducer-hook-fires-twice-how-to-pass-props-to-reducer/55056623#55056623
  return useReducer(reducer, initState);
};
