
const ACCESS_TOKEN_STORAGE_KEY = "access_token";
const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export function setAccessToken(access_token: string) {
  localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, access_token);
}

export function setRefreshToken(refresh_token: string) {
  localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, refresh_token);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function removeAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function removeRefreshToken() {
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function setTokens(
  access_token: string,
  refresh_token: string,
) {
  setAccessToken(access_token);
  setRefreshToken(refresh_token);
}

export function removeTokens() {
  removeAccessToken();
  removeRefreshToken();
}
