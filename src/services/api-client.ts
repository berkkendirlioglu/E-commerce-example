import { isTokenExpired } from "./jwt-utils";
import { getAccessToken } from "./storage";
import { refreshAccessToken } from "./collection/auth";

export const BASE_URL = "https://fe1111.projects.academy.onlyjs.com/api/v1";

export async function FetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = getAccessToken();

  // Access Token yoksa ve eğer access token zamanı geçtiyse refresh token ile post ederek yeni access token elde ediyoruz.
  if (!accessToken || isTokenExpired(accessToken!)) {
    await refreshAccessToken();
  }

  const headers = {
    Authorization: `Bearer ${getAccessToken()}`,
    "Content-Type": "application/json",
    ...options.headers,
  };

  const urlWithSlash = url.startsWith("/") ? url : "/" + url;

  const response = await fetch(BASE_URL + urlWithSlash, { ...options, headers });
  
  return response;
}
