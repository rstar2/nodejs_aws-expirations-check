import http from "../utils/http";

const API_URL_BASE = process.env.API_URL_BASE;

export function login(email: string, password: string): Promise<string> {
  return http(`${API_URL_BASE}/auth/login`, { email, password }).then(
    ({ token }) => token
  );
// return Promise.resolve("dummy-token");
}
