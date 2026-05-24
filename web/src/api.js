import { mockRequest } from "./mocks/authMock";

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000").replace(/\/$/, "");
const API_MODE = import.meta.env.VITE_API_MODE ?? "mock";
const TOKEN_KEY = "worktime_access_token";
const TOKEN_CHANGED_EVENT = "worktime-token-changed";

function notifyTokenChanged() {
  window.dispatchEvent(new Event(TOKEN_CHANGED_EVENT));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
  notifyTokenChanged();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  notifyTokenChanged();
}

export function subscribeTokenChanged(listener) {
  window.addEventListener(TOKEN_CHANGED_EVENT, listener);
  return () => window.removeEventListener(TOKEN_CHANGED_EVENT, listener);
}

export function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${(`00${char.charCodeAt(0).toString(16)}`).slice(-2)}`)
        .join("")
    );

    return JSON.parse(json);
  } catch {
    return null;
  }
}

function withQuery(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  return url.toString();
}

async function parseResponse(response) {
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    const message = data?.error || data?.detail || data?.raw || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

function authHeaders(extra = {}) {
  const token = getToken();
  if (!token) return extra;
  return { ...extra, Authorization: `Bearer ${token}` };
}

async function requestJson(path, { method = "GET", query = {}, body, auth = false } = {}) {
  if (API_MODE === "mock") {
    return mockRequest({
      path,
      method,
      query,
      body,
      token: auth ? getToken() : ""
    });
  }

  const response = await fetch(withQuery(path, query), {
    method,
    headers: auth ? authHeaders({ "Content-Type": "application/json" }) : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  return parseResponse(response);
}

export function getJson(path, query = {}, options = {}) {
  return requestJson(path, { ...options, method: "GET", query });
}

export function postJson(path, body = {}, options = {}) {
  return requestJson(path, { ...options, method: "POST", body });
}

export async function login(email, password) {
  const data = await postJson("/auth/login", { email, password });
  if (data.token) setToken(data.token);
  return data;
}

export async function register({ fio, email, password }) {
  const data = await postJson("/auth/register", { fio, email, password });
  if (data.token) setToken(data.token);
  return data;
}

export function logout() {
  clearToken();
}
