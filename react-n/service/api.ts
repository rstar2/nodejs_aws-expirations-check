import { AsyncFunction, ListItem } from "../types";
import http from "../utils/http";

const API_URL_BASE = process.env.API_URL_BASE;

// TODO: Not a very clean way to set the token like this
// 1. can create a module factory (or a class)
// 2. can pass it inside every method
let authToken: string | undefined;

export function setAuthToken(token: string) {
  authToken = token;
}
export function clearAuthToken() {
  authToken = undefined;
}

function parseItem(Item: any): ListItem {
	return {
		id: Item.id,
		name: Item.name,
		expiresAt: new Date(Item.expiresAt),
		daysBefore: Item.daysBefore,
		enabled: Item.enabled,
	  };
}

export async function getList(): Promise<ListItem[]> {
  return http(`${API_URL_BASE}/invoke/api/list`, undefined, authToken)
    .then((data) => data.Items)
    .then((Items: any[]) => Items.map(parseItem));
}

export const addListItem: AsyncFunction<
  Omit<ListItem, "id">,
  ListItem
> = async (item) => {
	return http(`${API_URL_BASE}/invoke/api/add`, item, authToken)
	.then(data => data.Item)
	.then(parseItem);
};

export const updateListItem: AsyncFunction<
  Partial<ListItem>,
  ListItem
> = async (item) => {
	return http(`${API_URL_BASE}/invoke/api/update`, item, authToken)
	.then(data => data.Item)
	.then(parseItem);
};

export const removeListItem: AsyncFunction<string, void> = async (id) => {
	return http(`${API_URL_BASE}/invoke/api/delete`, {id}, authToken)
	.then(data => data.Item)
	.then(parseItem)
	// not interested in the result
	.then();
};
