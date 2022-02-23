import React, { useMemo, useContext, useLayoutEffect } from "react";

import { ListAction, useListReducer } from "./reducer";
import { ListContextValue, ListItem, ListState } from "../../types";
import * as api from "../../service/api";
import { useAuthContext } from "../auth/context";
import { useLoadingContext } from "../loading/context";
import { useToastContext } from "../error/context";

const ListContext = React.createContext<ListContextValue | undefined>(
  undefined
);

function createListContextValue(
  state: ListState,
  dispatch: React.Dispatch<ListAction>,
  setLoading: (isLoading: boolean, text?: string) => void,
  showError: (error: string) => void
): ListContextValue {
  return {
    // current context state (e.g. the list)
    state,

    // send to server (async) and on response update (sync)

    add: async (item: Omit<ListItem, "id">) => {
      setLoading(true, "Adding...");
      try {
        const addedItem = await api.addListItem(item);
        dispatch({ type: "ADD", item: addedItem });
      } catch (err) {
        console.error("Failed to add new expiration-check", err);
        showError("Failed to add");
      } finally {
        setLoading(false);
      }
    },
    update: async (item: Partial<ListItem>) => {
      setLoading(true, "Updating...");
      try {
        const updatedItem = await api.updateListItem(item);
        dispatch({ type: "UPDATE", item: updatedItem });
		throw new Error("test");
      } catch (err) {
        console.error("Failed to update expiration-check", err);
        showError("Failed to update");
      } finally {
        setLoading(false);
      }
    },
    remove: async (id: string) => {
      setLoading(true, "Deleting...");
      try {
        await api.removeListItem(id);
        dispatch({ type: "DELETE", id });
      } catch (err) {
        console.error("Failed to delete expiration-check", err);
        showError("Failed to delete");
      } finally {
        setLoading(false);
      }
    },
    refresh: async () => {
      setLoading(true, "Refreshing...");
      try {
        const list = await api.getList();
        dispatch({ type: "REFRESH", list });
      } catch (err) {
        console.error("Failed to load/refresh expiration-checks", err);
        showError("Failed to refresh");
      } finally {
        setLoading(false);
      }
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

  const toastContext = useToastContext();
  const loadingContext = useLoadingContext();
  const authContext = useAuthContext();
  const authToken = authContext.state.authToken;

  // when there's a token available then set it
  // NOTE: it must be useLayoutEffect() as this is executed sync before the first render
  // (as the MainScreen will try to load the list on this first render)
  
  useLayoutEffect(() => {
    //console.log("ListContext - auth token ", authToken);
    if (authToken) api.setAuthToken(authToken);
    else api.clearAuthToken();
  }, [authToken]);

  // NOTE: you *might* need to memoize this value
  // Learn more in http://kcd.im/optimize-context
  const context = useMemo<ListContextValue>(
    () => createListContextValue(state, dispatch,
		loadingContext.setLoading,
		toastContext.show),
    [state, dispatch, loadingContext.setLoading, toastContext.show]
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
