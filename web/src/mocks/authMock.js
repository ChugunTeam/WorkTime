const USERS_KEY = "worktime_mock_users";
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 24;

function readUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getNextUserId(users) {
  return users.reduce((maxId, user) => Math.max(maxId, Number(user.id) || 0), 0) + 1;
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function base64UrlEncode(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function createToken(user) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "none", typ: "JWT" };
  const payload = {
    sub: user.id,
    fio: user.fio,
    email: user.email,
    iat: now,
    exp: now + TOKEN_LIFETIME_SECONDS
  };

  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.mock`;
}

function ok(data = {}) {
  return Promise.resolve({ ok: true, ...data });
}

function fail(message, status = 400) {
  const error = new Error(message);
  error.status = status;
  error.data = { ok: false, error: message };
  return Promise.reject(error);
}

function register(body) {
  const fio = String(body?.fio || "").trim();
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");

  if (!fio || !email || !password) {
    return fail("Заполните ФИО, email и пароль");
  }

  const users = readUsers();
  if (users.some((user) => user.email === email)) {
    return fail("Пользователь с таким email уже существует");
  }

  const user = {
    id: getNextUserId(users),
    fio,
    email,
    password
  };

  writeUsers([...users, user]);
  return ok({ token: createToken(user) });
}

function login(body) {
  const email = normalizeEmail(body?.email);
  const password = String(body?.password || "");
  const user = readUsers().find((item) => item.email === email && item.password === password);

  if (!user) {
    return fail("Неверный email или пароль", 401);
  }

  return ok({ token: createToken(user) });
}

export function mockRequest({ path, method, body }) {
  if (method === "POST" && path === "/auth/register") return register(body);
  if (method === "POST" && path === "/auth/login") return login(body);

  return fail(`Mock endpoint is not implemented: ${method} ${path}`, 404);
}
