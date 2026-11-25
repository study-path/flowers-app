import apiFetch from "./apiFetch";

export const createUser = ({ username, password }) =>
  apiFetch("POST", "/users", {
    username,
    password,
  });

export const createSession = ({ username, password }) =>
  apiFetch("POST", "/users/session", {
    username,
    password,
  });

const SESSION_STORAGE_KEY = "session_token";

export const setSessionTokenStorage = (sessionToken) =>
  localStorage.setItem(SESSION_STORAGE_KEY, sessionToken);

export const getSessionTokenStorage = () => {
  return localStorage.getItem(SESSION_STORAGE_KEY);
};

export const removeSessionTokenStorage = () => {
  return localStorage.removeItem(SESSION_STORAGE_KEY);
};
