import React, { useMemo, useContext, useLayoutEffect } from "react";

import { ListAction, useListReducer } from "./reducer";
import { ListContextValue, ListItem, ListState } from "../../types";
import * as api from "../../service/api";
import { useAuthContext } from "../auth/context";

const ListContext = React.createContext<ListContextValue | undefined>(
  undefined
);

function createListContextValue(
  state: ListState,
  dispatch: React.Dispatch<ListAction>,
  authToken?: string
): ListContextValue {
  return {
    state,
    add: async (item: Omit<ListItem, "id">) => {
      // TODO:
      // send to server and on response update
      dispatch({ type: "ADD", item: { ...item, id: "" + ID++ } });
    },
    update: async (item: Partial<ListItem>) => {
      // TODO:
      // send to server and on response update
      // dispatch({ type: "UPDATE", item });
    },
    remove: async (id: string) => {
      // TODO:
      // send to server and on response update
      dispatch({ type: "DELETE", id });
    },
    refresh: async () => {
      const list = await api.getList();

      // send to server and on response update
      dispatch({ type: "REFRESH", list });
    },
  };
}

let ID = 0;

export function ListContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useListReducer();

  // when there's a token available then set it
  // NOTE: it must be useLayoutEffect() as this is executed sync before the first render
  // (as the MainScreen will try to load the list on this first render)
  const authContext = useAuthContext();
  const authToken = authContext.state.authToken;
  useLayoutEffect(() => {
	  console.log('ListContext - auth token ', authToken)
    if (authToken) api.setAuthToken(authToken);
    else api.clearAuthToken();
  }, [authToken]);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<ListContextValue>(
    () => createListContextValue(state, dispatch),
    [state, dispatch]
  );

  return (
    <ListContext.Provider value={context}>{children}</ListContext.Provider>
  );
}

export function useListContext(): ListContextValue {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useListContext must be used within a ListContextProvider");
  }
  return context;
}
