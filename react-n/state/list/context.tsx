import React, { useMemo, useContext } from "react";

import { ListContextValue, ListItem, ListState } from "../../types";
import { ListAction, useListReducer } from "./reducer";

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
			// TODO:
			// send to server and on response update
			dispatch({ type: "REFRESH", list: [] });
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
