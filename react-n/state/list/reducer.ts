import { useReducer } from "react";

import { ListItem, ListState } from "./../../types";

const initState: ListState = {
	list: [],
};

export type ListAction =
	| ListActionAddOrUpdate
	| ListActionDelete
	| ListActionRefresh;

type ListActionAddOrUpdate = {
	type: "ADD" | "UPDATE";
	item: ListItem;
};
type ListActionDelete = {
	type: "DELETE";
	id: string;
};
type ListActionRefresh = {
	type: "REFRESH";
	list: ListItem[];
};

export const useListReducer = () => {
	return useReducer((prevState: ListState, action: ListAction): ListState => {
		let list;
		switch (action.type) {
			case "ADD":
				list = [...prevState.list, action.item];
				break;
			case "UPDATE":
				list = prevState.list.map((item) =>
					item.id === action.item.id ? action.item : item
				);
				break;
			case "DELETE":
				list = prevState.list.filter((item) => item.id !== action.id);
				break;
			case "REFRESH":
				list = action.list;
				break;
			default:
				throw new Error();
		}
		return {
			list,
		};
	}, initState);
};
