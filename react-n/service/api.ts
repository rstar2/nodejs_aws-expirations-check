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

export function parseItem(Item: any): ListItem {
  return {
    id: Item.id,
    name: Item.name,
    expiresAt: new Date(Item.expiresAt),
    daysBefore: Item.daysBefore,
    enabled: Item.enabled,
  };
}

function forExportItem(item: Partial<ListItem>): any {
  const res = { ...item } as any;
  if (item.expiresAt) res.expiresAt = item.expiresAt.getTime();
  return res;
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
  return http(`${API_URL_BASE}/invoke/api/add`, forExportItem(item), authToken)
    .then((data) => data.Item)
    .then(parseItem);
};

export const updateListItem: AsyncFunction<
  Partial<ListItem>,
  ListItem
> = async (item) => {
  return http(
    `${API_URL_BASE}/invoke/api/update`,
    forExportItem(item),
    authToken
  )
    .then((data) => data.Item)
    .then(parseItem);
};

export const removeListItem: AsyncFunction<string, void> = async (id) => {
  return (
    http(`${API_URL_BASE}/invoke/api/delete`, { id }, authToken)
      // not interested in the result
      .then()
  );
};
