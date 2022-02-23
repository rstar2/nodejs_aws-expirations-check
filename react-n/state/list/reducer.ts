import { useReducer } from "react";

import { ListItem, ListState } from "../../types";
import { sortByDate } from "../../utils";

const initState: ListState = {
  list: [],
};
const reducer = (prevState: ListState, action: ListAction): ListState => {
  let list;
  switch (action.type) {
    case "ADD":
      list = [...prevState.list, action.item];
	  // keep it sorted by date - could use a binary-search and insert
	  // as the current list is already sorted by this list is not so big, so no need the complexity
      list.sort(sortByDate);
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
	  // sort by date
      list.sort(sortByDate);
      break;
    default:
      throw new Error();
  }
  return {
    list,
  };
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
  // NOTE: the reducer function MUST NOT be defined as inline function here,
  // otherwise it will be each time a new function, so a dispatch(...) could cause calling the reducer twice
  // More info at:
  // https://stackoverflow.com/questions/54892403/usereducer-action-dispatched-twice
  // https://stackoverflow.com/questions/55055793/react-usereducer-hook-fires-twice-how-to-pass-props-to-reducer/55056623#55056623
  return useReducer(reducer, initState);
};
