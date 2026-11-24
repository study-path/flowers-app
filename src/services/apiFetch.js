import * as userService from "services/user";

// The API lives in this same project (the /api folder), so it is always served
// from the site's own origin — in development Vite proxies /api to the local server.
const API_BASE_URL = "/api";

const apiFetch = async (method, path, body = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  const sessionToken = userService.getSessionTokenStorage();
  if (sessionToken) {
    options.headers.Authorization = "Bearer " + sessionToken;
  }

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(API_BASE_URL + path, options);

  // The saved session expired or is no longer valid: sign out and go to sign-in.
  if (response.status === 401 && sessionToken) {
    userService.removeSessionTokenStorage();
    window.location.assign("/");
  }

  return response;
};

export default apiFetch;
