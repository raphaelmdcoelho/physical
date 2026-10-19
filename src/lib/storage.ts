import type { Gender, User, UserData } from './types';

/**
 * Local-only persistence: accounts and data live in this browser's localStorage.
 * Everything goes through this module so a real backend can replace it later.
 */
const USERS_KEY = 'physcal:users';
const SESSION_KEY = 'physcal:session';
const dataKey = (id: string) => `physcal:data:${id}`;

interface StoredUser extends User {
  salt: string;
  hash: string;
}

const read = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value));

const toHex = (buf: ArrayBuffer) =>
  [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');

async function hashPassword(password: string, salt: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 },
    key,
    256,
  );
  return toHex(bits);
}

const publicUser = ({ salt: _s, hash: _h, ...user }: StoredUser): User => user;

export async function register(input: {
  name: string;
  email: string;
  password: string;
  gender: Gender;
  birthdate: string;
}): Promise<User> {
  const users = read<StoredUser[]>(USERS_KEY, []);
  const email = input.email.trim().toLowerCase();
  if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists.');
  const salt = toHex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const user: StoredUser = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    email,
    gender: input.gender,
    birthdate: input.birthdate,
    salt,
    hash: await hashPassword(input.password, salt),
  };
  write(USERS_KEY, [...users, user]);
  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export async function login(emailInput: string, password: string): Promise<User> {
  const email = emailInput.trim().toLowerCase();
  const user = read<StoredUser[]>(USERS_KEY, []).find((u) => u.email === email);
  if (!user || (await hashPassword(password, user.salt)) !== user.hash) {
    throw new Error('Invalid email or password.');
  }
  localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function currentUser(): User | undefined {
  const id = localStorage.getItem(SESSION_KEY);
  const user = read<StoredUser[]>(USERS_KEY, []).find((u) => u.id === id);
  return user && publicUser(user);
}

export function updateUser(id: string, patch: Partial<Pick<User, 'name' | 'gender' | 'birthdate'>>): User {
  const users = read<StoredUser[]>(USERS_KEY, []);
  const next = users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  write(USERS_KEY, next);
  return publicUser(next.find((u) => u.id === id)!);
}

export const loadData = (id: string): UserData => read<UserData>(dataKey(id), { months: {}, pressure: [] });
export const saveData = (id: string, data: UserData) => write(dataKey(id), data);
