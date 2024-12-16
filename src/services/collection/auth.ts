import { BASE_URL, FetchWithAuth } from "../api-client";
import { isTokenExpired } from "../jwt-utils";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setTokens,
} from "../storage";
import {
  LoginPayload,
  AuthResponse,
  RegisterPayload,
  UsersType,
  UpdateProfileType
} from "../../types/AccountType";

export async function register(data: RegisterPayload) {
  const response = await fetch(BASE_URL + "/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const registerJson = (await response.json()) as UsersType;

  return registerJson;
}

export async function login(data: LoginPayload) {
  const response = await fetch(BASE_URL + "/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const loginJson = (await response.json()) as AuthResponse;

  setTokens(
    loginJson.access_token,
    loginJson.refresh_token,
  );

  return loginJson;
}

export async function getMyProfile() {
  // access token süresi geçmedi ise access token ile fetch etmek istediğimiz data'yı çekiyoruz
  const response = await FetchWithAuth("/users/my-account", {
    method: "GET",
  });

  const userJson = (await response.json()) as UsersType;

  return userJson;
}

export async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken || isTokenExpired(refreshToken)) {
    throw new Response(
      JSON.stringify("Refresh token is invalid"),
      { status: 401,statusText:"Refresh token is invalid", headers: { "Content-Type": "application/json" } }
    );
  }

  const response = await fetch(BASE_URL + "/auth/token/refresh", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  const responseJson = (await response.json()) as {accessToken:string};

  setAccessToken(responseJson.accessToken)

  return responseJson;
}

export async function UpdateMyProfile(data:UpdateProfileType){
    const response = await FetchWithAuth("/users/my-account",{
    method:"PUT",
    body: JSON.stringify(data),
  })

  const responseJson = (await response.json()) as UsersType;

  return responseJson;
}

// export async function logout() {
//   const refreshToken = getRefreshToken();

//   if (!refreshToken) {
//     throw new Response(
//       JSON.stringify({ message: "Refresh token is invalid" }),
//       { status: 401, statusText:"Refresh token is invalid", headers: { "Content-Type": "application/json" } }
//     );
//   }

//   const response = await fetch(BASE_URL + "/api/auth/logout", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${refreshToken}`,
//     },
//   });

//   const responseJson = (await response.json()) as {
//     message: string;
//   };

//   removeTokensAndAuthUser();

//   return responseJson;
// }
