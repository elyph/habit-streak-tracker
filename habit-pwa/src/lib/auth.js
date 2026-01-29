const USERS_KEY = "users_v1";
const SESSION_KEY = "session_v1";

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(userId) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({
    userId,
    createdAt: new Date().toISOString()
  }));
}
function getSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); }
  catch { return null; }
}

async function hashPassword(pw) {
  const data = new TextEncoder().encode(pw);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function makeId() {
  return (crypto.randomUUID?.() ?? (Math.random().toString(16).slice(2) + Date.now().toString(16)));
}

export function getCurrentUser() {
  const session = getSession();
  if (!session?.userId) return null;
  const users = loadUsers();
  return users.find(u => u.id === session.userId) || null;
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export async function register({ name, email, password }) {
  const users = loadUsers();
  const e = email.trim().toLowerCase();

  if (users.some(u => u.email === e)) {
    throw new Error("Bu e-posta zaten kayıtlı.");
  }
  if (password.length < 6) {
    throw new Error("Şifre en az 6 karakter olmalı.");
  }

  const passwordHash = await hashPassword(password);
  const user = {
    id: makeId(),
    name: name.trim() || "User",
    email: e,
    passwordHash,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  saveUsers(users);
  setSession(user.id);
  return user;
}

export async function login({ email, password }) {
  const users = loadUsers();
  const e = email.trim().toLowerCase();
  const user = users.find(u => u.email === e);

  if (!user) throw new Error("E-posta veya şifre hatalı.");

  const passwordHash = await hashPassword(password);
  if (passwordHash !== user.passwordHash) {
    throw new Error("E-posta veya şifre hatalı.");
  }

  setSession(user.id);
  return user;
}
